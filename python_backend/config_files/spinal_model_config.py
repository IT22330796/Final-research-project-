# -*- coding: utf-8 -*-

"""Application configuration for Eye Disease Model."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Model config (must match training)

IMG_SIZE = 224

CLASSES = ['healthy', 'diseased']

MODEL_PATH = os.environ.get(
'MODEL_PATH',
str(BASE_DIR / 'models' / 'spinal' / 'spinal_modal.keras')
)

# Flask settings

MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5000))
