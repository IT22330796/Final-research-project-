# -*- coding: utf-8 -*-
"""Model loading, preprocessing, prediction and Grad-CAM utilities."""

import io
import os
from typing import Optional

import cv2
import numpy as np
from PIL import Image

import config_files.digestive_model_config as digestive_config

_model = None


def load_model():
    """Load the Keras model (singleton)."""
    global _model
    if _model is None:
        import tensorflow as tf

        if not os.path.exists(digestive_config.MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {digestive_config.MODEL_PATH}")
        # Standard load
        _model = tf.keras.models.load_model(digestive_config.MODEL_PATH, compile=False)
    return _model


def _decode_and_resize(image_bytes: bytes) -> np.ndarray:
    """Decode raw bytes to RGB image and resize to model input size."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        img = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
    else:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    img = cv2.resize(img, (digestive_config.IMG_SIZE, digestive_config.IMG_SIZE))
    return img


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess image for model input.
    REVERTED: Raw pixel values (0-255) as requested.
    """
    img = _decode_and_resize(image_bytes)
    img = np.array(img, dtype=np.float32)
    # img = img / 255.0  # Removing normalization as it causes model to loop on 'normal'
    
    # Debug: Check if there's actual signal
    print(f"DEBUG: Digestive Preprocess - Mean: {np.mean(img):.2f}, Max: {np.max(img):.2f}")
    
    img = np.expand_dims(img, axis=0)
    return img


def predict(image_array: np.ndarray, image_bytes: Optional[bytes] = None) -> dict:
    """
    Run prediction and return class, confidence, and probabilities.
    Uses only the CNN model result — no Gemini API.
    """
    model = load_model()
    predictions = model.predict(image_array, verbose=0)
    probs = predictions[0]
    pred_idx = int(np.argmax(probs))
    pred_class = digestive_config.CLASSES[pred_idx]
    confidence = float(probs[pred_idx])

    # Standardize result format
    status = "issue_detected" if pred_class == "digestive" else "no_issue"
    
    # Calculate confidence level
    if confidence >= 0.85:
        confidence_level = "High"
    elif confidence >= 0.65:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    result = {
        "prediction": pred_class,
        "confidence": round(confidence * 100, 2),  # Return as percentage 0-100
        "confidence_level": confidence_level,
        "status": status,
        "probabilities": {
            cls: round(float(p), 4) for cls, p in zip(digestive_config.CLASSES, probs)
        },
    }

    return result



def compute_grad_cam(
    image_array: np.ndarray, layer_name: str, class_index: Optional[int] = None
) -> np.ndarray:
    """
    Compute Grad-CAM heatmap for a given conv layer.

    - image_array: preprocessed batch with shape (1, H, W, 3)
    - layer_name: name of the last convolutional layer in the model
    - class_index: optional target class index; if None, uses predicted class
    """
    import tensorflow as tf

    model = load_model()

    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(image_array)
        if class_index is None:
            class_index = int(tf.argmax(predictions[0]))
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.math.reduce_max(heatmap)
    heatmap = tf.where(max_val == 0, heatmap, heatmap / max_val)

    return heatmap.numpy()


def generate_grad_cam_image(
    image_bytes: bytes, layer_name: str, class_index: Optional[int] = None
) -> np.ndarray:
    """
    Generate a Grad-CAM overlay image for the given input bytes.

    Returns an RGB image (H, W, 3) as uint8.
    """
    # Base image for visualization (uint8 RGB)
    base_img = _decode_and_resize(image_bytes)

    # Preprocessed batch for the model
    input_batch = np.expand_dims(base_img.astype(np.float32), axis=0)

    heatmap = compute_grad_cam(input_batch, layer_name, class_index)
    heatmap = cv2.resize(heatmap, (base_img.shape[1], base_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(base_img, 0.6, heatmap_color, 0.4, 0)
    return overlay
