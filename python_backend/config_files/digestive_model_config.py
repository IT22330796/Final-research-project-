# -*- coding: utf-8 -*-
"""Application configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Model config (must match training)
IMG_SIZE = 256
CLASSES = ['digestive', 'normal']

MODEL_PATH = os.environ.get(
    'MODEL_PATH',
    str(BASE_DIR / 'models' / 'digestive' / 'hybrid_cbam_new_model.keras')
)

# Flask
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5000))
