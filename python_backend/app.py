# -*- coding: utf-8 -*-
"""
Flask API backend for Medical Models
Classification: digestive, liver, spinal
"""

import io
import os
import cv2
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

import config_files.digestive_model_config as digestive_config
import config_files.liver_model_config as liver_config
# import config_files.spinal_model_config as spinal_config

from model_utile_files.digestive_model_utils import (
    generate_grad_cam_image as generate_grad_cam_digestive,
    load_model as load_digestive_model,
    predict as predict_digestive,
    preprocess_image as preprocess_digestive_image,
)
from model_utile_files.liver_model_utils import (
    generate_grad_cam_liver_image as generate_grad_cam_liver,
    load_liver_model,
    predict_liver,
    preprocess_liver_image,
)
from model_utile_files.spinal_model_utils import (
    predict as predict_spinal,
    preprocess_image as preprocess_spinal_image,
)
from model_utile_files.liver_clinical_utils import predict_liver_risk

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = digestive_config.MAX_CONTENT_LENGTH

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "API is running"})

# --- Digestive Routes ---

@app.route("/digestive/predict", methods=["POST"])
def digestive_predict_endpoint():
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        img_array = preprocess_digestive_image(image_bytes)
        result = predict_digestive(img_array, image_bytes=image_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/digestive/grad-cam", methods=["POST"])
def digestive_grad_cam_endpoint():
    try:
        if "image" in request.files:
            file = request.files["image"]
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        layer_name = request.form.get("layer_name") or request.args.get("layer_name")
        if not layer_name:
            return jsonify({"error": "Missing required parameter 'layer_name'"}), 400

        overlay = generate_grad_cam_digestive(image_bytes=image_bytes, layer_name=layer_name)
        bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".png", bgr)
        return send_file(io.BytesIO(buffer.tobytes()), mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Liver Routes ---

@app.route("/liver/predict", methods=["POST"])
def liver_predict_endpoint():
    """Predict liver disease from uploaded image."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        img_array = preprocess_liver_image(image_bytes)
        result = predict_liver(img_array, image_bytes=image_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/liver/grad-cam", methods=["POST"])
def liver_grad_cam_endpoint():
    """Generate Grad-CAM visualization for liver model."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        layer_name = request.form.get("layer_name") or request.args.get("layer_name")
        if not layer_name:
            return jsonify({"error": "Missing required parameter 'layer_name'"}), 400

        overlay = generate_grad_cam_liver(image_bytes=image_bytes, layer_name=layer_name)
        bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".png", bgr)
        return send_file(io.BytesIO(buffer.tobytes()), mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/liver/predict-clinical", methods=["POST"])
def liver_predict_clinical_endpoint():
    """Predict liver disease risk from clinical data."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        prediction = predict_liver_risk(data)
        return jsonify({"prediction": prediction})
    except Exception as e:
        print(f"Error in liver-clinical prediction: {e}")
        return jsonify({"error": str(e)}), 500

# --- Spinal Routes ---

@app.route("/spinal/predict", methods=["POST"])
def spinal_predict_endpoint():
    """Predict spinal disease from uploaded image."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        img_array = preprocess_spinal_image(image_bytes)
        result = predict_spinal(img_array)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Info Routes ---

@app.route("/liver/model-info", methods=["GET"])
def liver_model_info():
    """Return liver model configuration."""
    return jsonify({
        "classes": liver_config.CLASSES,
        "input_size": [liver_config.IMG_SIZE, liver_config.IMG_SIZE],
        "model_path": liver_config.MODEL_PATH,
    })

@app.route("/digestive/model-info", methods=["GET"])
def digestive_model_info():
    return jsonify({
        "classes": digestive_config.CLASSES,
        "input_size": [digestive_config.IMG_SIZE, digestive_config.IMG_SIZE],
        "model_path": digestive_config.MODEL_PATH,
    })

# @app.route("/spinal/model-info", methods=["GET"])
# def spinal_model_info():
#     return jsonify({
#         "classes": spinal_config.CLASSES,
#         "input_size": [spinal_config.IMG_SIZE, spinal_config.IMG_SIZE],
#         "model_path": spinal_config.MODEL_PATH,
#     })


if __name__ == "__main__":
    # Lazy loading: Models will be loaded on first request via their respective utility functions
    print("Starting Flask server... Models will be loaded on demand.")
    
    # Verify model files exist
    for cfg in [digestive_config, liver_config]:
        if os.path.exists(cfg.MODEL_PATH):
            print(f"Verified: {cfg.MODEL_PATH} exists.")
        else:
            print(f"Warning: {cfg.MODEL_PATH} NOT found.")

    app.run(host=digestive_config.HOST, port=digestive_config.PORT, debug=True)

