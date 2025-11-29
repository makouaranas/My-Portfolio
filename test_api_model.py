import requests
import json

import os

# Try to load from .env file manually if python-dotenv is not available
def load_env():
    try:
        with open('.env', 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value
    except FileNotFoundError:
        pass

load_env()

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("Error: OPENROUTER_API_KEY not found in .env or environment variables.")
    exit(1)

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
