import os
import pickle
import pandas as pd
import numpy as np
import tensorflow as tf
from typing import Dict, Any

# Path to models
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'liver', 's_model')

# Global variables for models
_xgb_model = None
_mlp_model = None
_scaler = None
_label_encoder = None
_columns = None

def load_models():
    """Load all necessary models for liver disease risk prediction."""
    global _xgb_model, _mlp_model, _scaler, _label_encoder, _columns
    
    if _xgb_model is None:
        xgb_path = os.path.join(MODEL_DIR, 'xgb_model.pkl')
        with open(xgb_path, 'rb') as f:
            _xgb_model = pickle.load(f)
            
    if _mlp_model is None:
        mlp_path = os.path.join(MODEL_DIR, 'mlp_model.h5')
        _mlp_model = tf.keras.models.load_model(mlp_path)
        
    if _scaler is None:
        scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
        with open(scaler_path, 'rb') as f:
            _scaler = pickle.load(f)
            
    if _label_encoder is None:
        le_path = os.path.join(MODEL_DIR, 'label_encoder.pkl')
        with open(le_path, 'rb') as f:
            _label_encoder = pickle.load(f)
            
    if _columns is None:
        # Try to load columns.pkl if it exists, otherwise use default order
        columns_path = os.path.join(MODEL_DIR, 'columns.pkl')
        if os.path.exists(columns_path):
            with open(columns_path, 'rb') as f:
                _columns = pickle.load(f)
        else:
            # Fallback to default expected columns
            _columns = ['age', 'tb', 'db', 'sgpt', 'sgot', 'alkphos', 'tp', 'alb', 'a/g_ratio', 'gender_Male']
            
    return _xgb_model, _mlp_model, _scaler, _label_encoder, _columns

def predict_liver_risk(data: Dict[str, Any]) -> str:
    """
    Predict liver disease risk level using a hybrid model (XGBoost + MLP).
    """
    xgb_model, mlp_model, scaler, label_encoder, columns = load_models()
    
    # Create DataFrame and ensure column alignment
    df = pd.DataFrame([data])
    
    # Handle missing fields with default values (0 for simplicity or median if known)
    for col in columns:
        if col not in df.columns:
            df[col] = 0.0
            
    # Align columns
    df = df[columns]
    
    # Preprocessing
    # Scale data for MLP
    scaled_data = scaler.transform(df)
    
    # XGBoost Prediction (Probabilities)
    # Note: If it's a multi-class model, predict_proba returns [batch, num_classes]
    xgb_probs = xgb_model.predict_proba(df)
    
    # Neural Network (MLP) Prediction
    mlp_probs = mlp_model.predict(scaled_data, verbose=0)
    
    # Combine predictions: final = average(XGBoost + MLP)
    # Ensure they have the same shape
    final_probs = (xgb_probs + mlp_probs) / 2.0
    
    # Get final class label
    final_class_idx = np.argmax(final_probs, axis=1)[0]
    prediction = label_encoder.inverse_transform([final_class_idx])[0]
    
    # Mapping to Low, Medium, High if necessary
    # (Assuming label_encoder maps to these or similar)
    # If the labels are 1, 2, 3 or similar, we might need a mapping
    # But label_encoder should handle it.
    
    return str(prediction)
