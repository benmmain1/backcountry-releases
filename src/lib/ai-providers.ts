export type ProviderId = "anthropic" | "openai" | "google" | "custom";

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  defaultModel: string;
  modelHint: string;
  keyPlaceholder: string;
  needsBaseUrl?: boolean;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    defaultModel: "claude-sonnet-5",
    modelHint: "e.g. claude-sonnet-5, claude-opus-5, claude-haiku-4-5-20251001",
    keyPlaceholder: "sk-ant-...",
  },
  {
    id: "openai",
    label: "OpenAI (GPT)",
    defaultModel: "gpt-4o-mini",
    modelHint: "e.g. gpt-4o-mini, gpt-4o, o4-mini",
    keyPlaceholder: "sk-...",
  },
  {
    id: "google",
    label: "Google (Gemini)",
    defaultModel: "gemini-1.5-flash",
    modelHint: "e.g. gemini-1.5-flash, gemini-1.5-pro",
    keyPlaceholder: "AIza...",
  },
  {
    id: "custom",
    label: "Custom (OpenAI-compatible)",
    defaultModel: "",
    modelHint: "Model name required by your endpoint (Groq, Together, Ollama, etc.)",
    keyPlaceholder: "API key (if required)",
    needsBaseUrl: true,
  },
];

export function getProvider(id: ProviderId): ProviderConfig {
  const p = PROVIDERS.find((p) => p.id === id);
  if (!p) throw new Error(`Unknown provider: ${id}`);
  return p;
}
