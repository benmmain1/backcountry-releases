import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ALL_SPOTS } from "@/lib/spots";
import { buildSpotsContext, SYSTEM_PROMPT } from "@/lib/ai-context";

export const runtime = "nodejs";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.object({
  provider: z.enum(["anthropic", "openai", "google", "custom"]),
  apiKey: z.string().min(1, "API key is required"),
  model: z.string().min(1, "Model is required"),
  baseUrl: z.string().url().optional(),
  messages: z.array(chatMessageSchema).min(1),
});

const MAX_TOKENS = 1024;
const REQUEST_TIMEOUT_MS = 30_000;

function timeoutSignal() {
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await req.json());
  } catch (err) {
    const message = err instanceof z.ZodError ? err.issues.map((i) => i.message).join("; ") : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const system = SYSTEM_PROMPT + buildSpotsContext(ALL_SPOTS);

  try {
    switch (body.provider) {
      case "anthropic":
        return await callAnthropic(body, system);
      case "openai":
        return await callOpenAI(body, system, "https://api.openai.com/v1/chat/completions");
      case "custom":
        if (!body.baseUrl) {
          return NextResponse.json({ error: "baseUrl is required for custom provider" }, { status: 400 });
        }
        return await callOpenAI(body, system, body.baseUrl);
      case "google":
        return await callGoogle(body, system);
      default:
        return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error contacting provider";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

async function callAnthropic(body: z.infer<typeof requestSchema>, system: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": body.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: body.model,
      max_tokens: MAX_TOKENS,
      system,
      messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
    }),
    signal: timeoutSignal(),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data?.error?.message ?? "Anthropic request failed" }, { status: res.status });
  }
  const text = data?.content?.[0]?.text ?? "";
  return NextResponse.json({ reply: text });
}

async function callOpenAI(body: z.infer<typeof requestSchema>, system: string, endpoint: string) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${body.apiKey}`,
    },
    body: JSON.stringify({
      model: body.model,
      messages: [{ role: "system", content: system }, ...body.messages],
      max_tokens: MAX_TOKENS,
    }),
    signal: timeoutSignal(),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data?.error?.message ?? "OpenAI-compatible request failed" }, { status: res.status });
  }
  const text = data?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ reply: text });
}

async function callGoogle(body: z.infer<typeof requestSchema>, system: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    body.model
  )}:generateContent?key=${encodeURIComponent(body.apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: body.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: MAX_TOKENS },
    }),
    signal: timeoutSignal(),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data?.error?.message ?? "Google request failed" }, { status: res.status });
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ?? "";
  return NextResponse.json({ reply: text });
}
