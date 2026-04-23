import requests
import io
import json
from PIL import Image

# Create a small dummy image for testing
img = Image.new('RGB', (100, 100), color='white')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='PNG')
img_byte_arr.seek(0)

# Send request to endpoint
url = 'http://127.0.0.1:5000/spinal/predict'
files = {'image': ('test_image.png', img_byte_arr, 'image/png')}

try:
    response = requests.post(url, files=files)
    with open('pytest_result.json', 'w') as f:
        json.dump(response.json(), f, indent=2)
except Exception as e:
    print(f"Error: {e}")
