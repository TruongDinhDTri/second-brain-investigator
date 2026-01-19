# Second Brain Investigator 🧠

A powerful "Second Brain" interface that bridges your **Notion** workspace with **Google's Gemini AI**, allowing you to search, query, and interact with your personal knowledge base using natural language.

## ✨ Features

- **🔍 Intelligent Notion Search:** Quickly find pages and database entries in your Notion workspace.
- **💬 AI Chat Interface:** Interact with your data using a chat interface powered by Google's Gemini.
- **⚡ Modern Tech Stack:** Built with React 19, Vite, and Python (Flask).
- **🔒 Secure Proxy:** Uses a local Python backend to securely handle API keys and requests.

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite**
- **TypeScript**
- **@google/genai** (Google Generative AI SDK)

### Backend
- **Python 3.13**
- **Flask** (API Proxy)
- **Notion API**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.13+)
- A **Notion Integration Token** (from [Notion Developers](https://www.notion.so/my-integrations))

### 1. Backend Setup (Python)

Navigate to the project root and set up the Python environment.

```bash
# Create a virtual environment (if not already created)
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies (ensure flask and requests are installed)
pip install flask flask-cors requests
```

**Configuration:**
Open `server.py` and set your Notion API Key (or set it as an environment variable `NOTION_API_KEY`):

```python
# In server.py
NOTION_API_KEY = os.environ.get("NOTION_API_KEY", "secret_YOUR_KEY_HERE")
```

**Run the Server:**
```bash
python server.py
# Server runs on http://127.0.0.1:8000
```

### 2. Frontend Setup (React)

Open a new terminal window.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📖 Usage

1.  **Search:** Use the search bar to find Notion pages. The request is proxied through the Python backend to avoid CORS issues and secure your API key.
2.  **Chat:** (Coming Soon/In Progress) Use the chat interface to ask questions about your notes, powered by Gemini.

## 🤝 Contributing

Feel free to open issues or pull requests to improve the Investigator!
