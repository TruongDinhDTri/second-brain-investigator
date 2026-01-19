# server.py (The One-File Python Bridge)
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import sys

# --- CONFIGURATION (The Engine Room) ---

# ⚠️ SECURITY WARNING: For a real deployment, never hardcode secrets. 
# Use environment variables (os.environ.get('NOTION_KEY'))
# However, for this local dev environment, paste your key here:
NOTION_API_KEY = os.environ.get("NOTION_API_KEY", "Replace_With_Your_Key_If_Not_Using_Env_Vars") 
NOTION_VERSION = "2022-06-28"

if NOTION_API_KEY == "Nothing":
    print("--- ❌ CRITICAL ERROR ---")
    print("Please replace 'secret_YOUR_REAL_NOTION_KEY_HERE' in server.py with your actual Notion Integration Secret.")
    sys.exit(1)

# --- FLASK APP SETUP ---

app = Flask(__name__)
# This allows your frontend (localhost:5173) to talk to the backend (localhost:8000)
CORS(app) 

@app.route('/api/search', methods=['POST'])
def notion_search_proxy():
    if request.method != 'POST':
        return jsonify({'error': 'Method not allowed'}), 405
        
    try:
        # 1. Listen to the React Artist 👂
        data = request.json
        query = data.get('query', '')
        
        print(f"\n🕵️ BRIDGE: Searching Notion for '{query}'...")

        # 2. Prepare the request to Notion securely 🛡️
        url = "https://api.notion.com/v1/search"
        headers = {
            "Authorization": f"Bearer {NOTION_API_KEY}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION
        }
        payload = {
            "query": query,
            "page_size": 15, # Total Recall setting
            "sort": {"direction": "descending", "timestamp": "last_edited_time"}
        }

        # 3. Get the gold from Notion 🏆
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status() # Raise error for bad status codes (4xx or 5xx)
        
        # 4. Hand the raw data back to React 🤲
        return jsonify(response.json())

    except requests.exceptions.HTTPError as e:
        print(f"❌ Notion API Error: {e.response.status_code}")
        # Pass Notion's error response back to the frontend
        return jsonify(e.response.json()), e.response.status_code
        
    except Exception as e:
        print(f"❌ Internal Server Error: {e}")
        return jsonify({'error': 'Internal Server Error', 'detail': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Python Bridge running on http://127.0.0.1:8000")
    # Using threaded=True for smooth development performance
    app.run(port=8000, debug=True, threaded=True)
