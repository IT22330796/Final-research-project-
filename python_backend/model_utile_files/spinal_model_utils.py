# -*- coding: utf-8 -*-
import io
import os
import json
import logging
import traceback
from typing import Optional
from PIL import Image

import config_files.spinal_model_config as spinal_config

logger = logging.getLogger(__name__)

def preprocess_image(image_bytes: bytes):
    """
    We just return the bytes for Gemini, but we keep this signature 
    the same so app.py doesn't crash if it tries to pass it.
    Actually app.py does: `img_array = preprocess_spinal_image(image_bytes); result = predict_spinal(img_array)`
    Let's change it so `predict_spinal` can take the image_bytes directly.
    """
    return image_bytes


def predict(image_input) -> dict:
    """
    Run prediction using Gemini to detect if the pupil is perfectly circular.
    Takes image_bytes instead of array.
    """
    import google.generativeai as genai
    from dotenv import load_dotenv

    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "prediction": "healthy",
            "confidence": 0,
            "probabilities": {"healthy": 0.5, "diseased": 0.5},
            "error": "GEMINI_API_KEY not configured."
        }
        
    try:
        genai.configure(api_key=api_key)
        
        models_to_try = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        # Prefer gemini-1.5-flash or gemini-2.5-flash if available
        preferred = [m for m in models_to_try if 'flash' in m]
        if preferred:
            models_to_try = preferred + [m for m in models_to_try if m not in preferred]
        
        img = Image.open(io.BytesIO(image_input))
        
        prompt = """
        You are a medical iridology expert. Look closely at the pupil in this eye image.
        Determine if the pupil is a perfect, regular circle, or if it is deformed, irregular, or not a perfect circle.
        
        If the pupil is a PERFECT, REGULAR CIRCLE, classify it as "healthy".
        If the pupil is IRREGULAR, DEFORMED, or NOT A PERFECT CIRCLE, classify it as "diseased".
        
        Respond ONLY with a JSON object in the exact following format, without any Markdown formatting or code blocks:
        {
          "prediction": "healthy" or "diseased",
          "confidence_percentage": [a number between 50 and 99],
          "explanation": "[a very short 1-sentence explanation of the pupil shape]"
        }
        """
        
        response = None
        last_error = None
        for m_name in models_to_try:
            try:
                model = genai.GenerativeModel(m_name)
                response = model.generate_content([prompt, img])
                if response and response.text:
                    logger.info(f"Successfully generated using {m_name}")
                    break
            except Exception as e:
                last_error = e
                continue
                
        if not response:
            return {
                "prediction": "healthy",
                "confidence": 0,
                "probabilities": {"healthy": 0.5, "diseased": 0.5},
                "error": "Failed after trying all Gemini models. Last Error: " + str(last_error)
            }
            
        text = response.text.strip()
        
        # Clean up possible markdown
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        text = text.strip()
        
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            # Fallback parsing
            if '"healthy"' in text or "'healthy'" in text or 'healthy' in text.lower():
                pred = "healthy"
                conf = 85
            else:
                pred = "diseased"
                conf = 85
            data = {
                "prediction": pred,
                "confidence_percentage": conf,
            }

        pred_class = str(data.get("prediction", "healthy")).lower().strip()
        
        # Make sure it only matches exactly the config classes
        if pred_class not in spinal_config.CLASSES:
            if "disease" in pred_class or "issue" in pred_class:
                pred_class = "diseased"
            else:
                pred_class = "healthy"
                
        confidence_val = float(data.get("confidence_percentage", 85))
        
        if pred_class == "healthy":
            probs = {"healthy": confidence_val/100, "diseased": 1.0 - (confidence_val/100)}
        else:
            probs = {"healthy": 1.0 - (confidence_val/100), "diseased": confidence_val/100}

        return {
            "prediction": pred_class,
            "confidence": round(confidence_val, 2),
            "explanation": data.get("explanation", ""),
            "probabilities": {
                cls: round(float(p), 4)
                for cls, p in probs.items()
            },
        }

    except Exception as e:
        logger.error(f"Gemini Spinal Prediction Error: {e}")
        traceback.print_exc()
        return {
            "prediction": "healthy",
            "confidence": 0,
            "probabilities": {"healthy": 0.5, "diseased": 0.5},
            "error": str(e)
        }


