/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// src/index.js

// 👇 Set this to your GitHub Pages origin once things work.
// During testing you can leave "*" (wildcard), but lock it down later.
const ALLOW_ORIGIN = "*"; // e.g. "https://sidbharwani.github.io"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Simple health check
    if (request.method === "GET" && new URL(request.url).pathname === "/health") {
      return json({ ok: true, service: "study-ai worker" });
    }

    if (request.method !== "POST") {
      return json({ error: "Not found" }, 404);
    }

    // Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const prompt = (body && body.prompt) || "";
    if (!prompt) {
      return json({ error: "Missing 'prompt' string in body" }, 400);
    }

    if (!env.OPENAI_API_KEY) {
      return json({ error: "Server misconfigured: OPENAI_API_KEY not set" }, 500);
    }

    // Build OpenAI request — CHEAP model
    const openaiRequest = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful study tutor. Be clear and concise." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    };

    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(openaiRequest),
      });

      if (!r.ok) {
        // Pass through OpenAI error text to help debugging
        const errText = await r.text();
        return json({ error: `OpenAI ${r.status}: ${errText}` }, r.status);
      }

      const data = await r.json();
      const reply = data?.choices?.[0]?.message?.content ?? "";

      return json({ reply });
    } catch (e) {
      return json({ error: String(e) }, 500);
    }
  },
};

// Helper to return JSON with CORS
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

