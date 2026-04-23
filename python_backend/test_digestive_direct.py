"""
Test ALL possible preprocessing approaches to find which one makes the model discriminate
"""
import sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config_files.digestive_model_config as cfg
import tensorflow as tf

m = tf.keras.models.load_model(cfg.MODEL_PATH, compile=False)
print(f"Model input shape: {m.input_shape}")
print()

def test_with_preprocess(name, preprocess_fn):
    # Test with black, brown iris, red iris, white
    images = {
        "black": np.zeros((256,256,3), dtype=np.uint8),
        "white": np.full((256,256,3), 255, dtype=np.uint8),
        "brown_iris": np.full((256,256,3), [139,90,43], dtype=np.uint8),
        "red_iris":   np.full((256,256,3), [220,60,60], dtype=np.uint8),
    }
    results = {}
    for img_name, img in images.items():
        arr = preprocess_fn(img)
        arr = np.expand_dims(arr.astype(np.float32), 0)
        probs = m.predict(arr, verbose=0)[0]
        results[img_name] = f"dig={probs[0]*100:.1f}% nrm={probs[1]*100:.1f}%"

    # Check if all results are the same (model not responding)
    vals = list(results.values())
    all_same = all(v == vals[0] for v in vals)
    status = "❌ SAME OUTPUT - model not responding" if all_same else "✅ DIFFERENT OUTPUTS - model responding!"
    print(f"[{name}] {status}")
    if not all_same:
        for k, v in results.items():
            print(f"  {k}: {v}")
    return not all_same

# 1. /255.0
test_with_preprocess("/255.0",            lambda img: img / 255.0)

# 2. No normalization (raw 0-255)
test_with_preprocess("Raw 0-255",         lambda img: img.astype(np.float32))

# 3. /127.5 - 1  (-1 to 1)
test_with_preprocess("/127.5-1 (-1 to 1)", lambda img: img.astype(np.float32)/127.5 - 1.0)

# 4. ImageNet mean subtraction (common for VGG/ResNet)
def imagenet_preprocess(img):
    img = img.astype(np.float32)
    mean = np.array([123.68, 116.779, 103.939])
    return img - mean
test_with_preprocess("ImageNet mean sub",  imagenet_preprocess)

# 5. tf.keras.applications.mobilenet_v2.preprocess_input (-1 to 1)
test_with_preprocess("MobileNetV2",       lambda img: tf.keras.applications.mobilenet_v2.preprocess_input(img.astype(np.float32)).numpy())

# 6. tf.keras.applications.efficientnet.preprocess_input
test_with_preprocess("EfficientNet",      lambda img: tf.keras.applications.efficientnet.preprocess_input(img.astype(np.float32)).numpy())

# 7. tf.keras.applications.vgg16.preprocess_input
test_with_preprocess("VGG16",             lambda img: tf.keras.applications.vgg16.preprocess_input(img.astype(np.float32)).numpy())

# 8. /255 then (x - 0.5) / 0.5
test_with_preprocess("Std normalize",     lambda img: (img.astype(np.float32)/255.0 - 0.5) / 0.5)

print()
print("Done.")
