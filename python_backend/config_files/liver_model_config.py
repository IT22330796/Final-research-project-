# -*- coding: utf-8 -*-
"""Liver model configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Model config (must match training)
IMG_SIZE = 224
CLASSES = ['liver', 'normal']

MODEL_PATH = os.environ.get(
    'LIVER_MODEL_PATH',
    str(BASE_DIR / 'models' / 'liver' / 'final_hybrid_liver_model.keras')
)

# Flask (Reusing same settings or can be specific)
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5100)) # Different port if running separately, but usually same app
