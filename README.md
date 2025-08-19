# Study AI - Backend
This repository contains the **backend** for my personal summer project, **Study AI**, built to make studying faster, responsive, and more effective. This backend contains a **serverless API** hosted on **Cloudflare Workers** that securely connects the frontend to the **OpenAI API**.

The backend handles: 
* AI-powered **flashcard** generation
* **Practice tests** with customizable difficulty
* Effective **study guides** created automatically through AI
* **Step-by-step solutions** for problem solving

<img width="1315" height="880" alt="Screenshot 2025-08-18 at 12 38 23 PM" src="https://github.com/user-attachments/assets/7b0cb0c8-8138-43a6-aceb-fd908b33e192" />



  ---
  ## Features
  * Accepts **POST** requests with user prompts + optional chat history
  * Calls **OpenAI API** with a secure server-side key (never exposed to frontend users)
  * Supports multiple study modes mentioned above and has preset keys for easy access

---
## Tech Stack
* **Cloudflare Workers** (Serverless deployment)
* **JavaScript**
* **OpenAI API**
* **Wrangler CLI** for local development & deployment

---
## Installation & Setup 

**1. Clone the Repository** 
```bash
git clone https://github.com/sidbharwani/study-ai-backend.git
cd study-ai-backend
```

**2. Create a .gitignore**
```bash
node_modules
.env
.env.*
.dev.vars
.DS_Store
dist
```

**3. Install Dependencies**
```bash
npm install
```

**4. Configure Wrangler**
```bash
npm install -g wrangler
wrangler login
```

**4. Set Environment Variables**
```bash
wrangler secret put OPENAI_API_KEY
````
**5. Set secrets (do not commit keys)**
```bash
wrangler secret put OPENAI_API_KEY
```

**6. Verify config**
This project uses a Wrangler config. If you use JSONC, ensure you have a wrangler.jsonc like:
```bash
{
  "name": "study-ai-backend",
  "main": "src/index.js",
  "compatibility_date": "2024-11-12"
}
```
Alternatively, you can use wrangler.toml with equivalent fields. Use one format only (JSONC or TOML).

**7. Local Deployment**
```bash
npm run dev
```
Local URL: http://127.0.0.1:8787

```bash
curl -X POST "http://127.0.0.1:8787/" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Topic: Physics\nLevel: basic\nCount: 5","history":[]}'
```

**8. Deployment**
Deploy to Cloudflare Workers:
```bash
npm run deploy
```

You will get a URL like:
```
https://study-ai-backend.<your-Cloudflare-subdomain>.workers.dev
```

Therefore, update your frontend to use: 
```
const BACKEND_URL = "https://study-ai-backend.<your-Cloudflare-subdomain>.workers.dev"
```
---
## API Endpoints
**POST/Body:**
```json
{
  "prompt": "Topic: Newton's Laws\nLevel: basic\nCount: 5",
  "history": []
}
```

**Response:**
```json
{
  "reply": "Q: What is Newton's First Law? ...",
  "mode": "flashcards"
}
```
**Get /health**
**Response:**
```json
{
"ok": true, "service": "study-ai-backend"
}
```

---
## Why I Built This? 
Most study platforms (Quizlet, Kahoot, Chegg), even though use AI to make  preparation of guides, flashcards, and tests easier and faster, I wanted to make an AI chat-centric interface so that without learning the platform, one can automatically shoot a text to AI and instruct it to do the following features mentioned above. 

With **Study AI**, you can type your topic, and AI instantly creates ready-to-use study content. 

This backend powers that experience - securely, reliably, and at scale. 

---
## Related Repositories
Frontend: [study-ai-frontend](https://github.com/sidbharwani/study-ai-backend)
