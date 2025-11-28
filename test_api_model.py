import requests
import json

API_KEY = "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"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Portfolio Test"
}

# User requested model
model = "x-ai/grok-4.1-fast" 
# Note: If this model doesn't exist, OpenRouter usually returns 404 or 400, not 401. 
# 401 is almost always Auth.

data = {
    "model": model,
    "messages": [
        {"role": "user", "content": "Hello"}
    ]
}

try:
    print(f"Testing with model: {model}")
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, verify=False)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
