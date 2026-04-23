"""
Final Stress Test to find any preprocessing that makes the model discriminate. (ASCII only version)
"""
import sys, os
import numpy as np
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf

MODEL_PATH = r"D:\Reseage\research_project\python_backend\models\digestive\hybrid_cbam_new_model.keras"
CLASSES = ['digestive', 'normal']

if not os.path.exists(MODEL_PATH):
    print(f"ERROR: Model not found at {MODEL_PATH}")
    sys.exit(1)

m = tf.keras.models.load_model(MODEL_PATH, compile=False)

def test_method(name, proc_fn):
    print(f"--- Method: {name} ---")
    imgs = {
        "Black": np.zeros((1, 256, 256, 3), dtype=np.float32),
        "White": np.ones((1, 256, 256, 3), dtype=np.float32) * 255.0,
        "Random": np.random.uniform(0, 255, (1, 256, 256, 3)).astype(np.float32)
    }
    
    unique_preds = []
    for k, img in imgs.items():
        processed = proc_fn(img)
        preds = m.predict(processed, verbose=0)[0]
        p_str = f"[{preds[0]:.4f}, {preds[1]:.4f}]"
        # Since floats can vary slightly, check with a tolerance
        is_duplicate = False
        for up in unique_preds:
            # simple check
            if up == p_str:
                is_duplicate = True
                break
        if not is_duplicate:
            unique_preds.append(p_str)
        print(f"  {k}: {p_str}")
    
    if len(unique_preds) > 1:
        print("  YES DISCRIMINATES!")
    else:
        print("  NO CONSTANT OUTPUT")
    print()

test_method("Div 255 (0 to 1)", lambda x: x / 255.0)
test_method("No Norm (0 to 255)", lambda x: x)
test_method("Rescale (-1 to 1)", lambda x: (x / 127.5) - 1.0)
test_method("Standardize", lambda x: (x - np.mean(x)) / (np.std(x) + 1e-7))

# Check for hidden preprocessing layer in model
for layer in m.layers:
    l_lower = layer.name.lower()
    if "rescaling" in l_lower or "normalization" in l_lower or "input" in l_lower:
        print(f"Found layer: {layer.name} - {type(layer).__name__}")
        try:
              print(f"  Config: {layer.get_config()}")
        except:
              pass
