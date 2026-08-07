"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Settings, Sparkles, X } from "lucide-react";
import { useAISettings } from "@/lib/use-ai-settings";
import { AISettingsModal } from "./AISettingsModal";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Best alpine lake spot reachable in a sedan",
  "Somewhere with incredible sunrise views in October",
  "Dark-sky stargazing spot with no cell signal",
  "Easy high-clearance spot near a hot spring",
];

export function AIChatPanel({ onClose }: { onClose: () => void }) {
  const { settings, save, hasKey, loaded } = useAISettings();
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // One-time nudge to configure a key once settings have loaded from storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (loaded && !hasKey) setShowSettings(true);
  }, [loaded, hasKey]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    if (!hasKey) {
      setShowSettings(true);
      return;
    }
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provider: settings.provider,
          apiKey: settings.apiKey,
          model: settings.model,
          baseUrl: settings.baseUrl || undefined,
          messages: nextMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessages([...nextMessages, { role: "assistant", content: data.reply || "(no response)" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-stone-700 bg-stone-950 text-stone-100 shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-400" />
          <h2 className="font-semibold">AI Trail Guide</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(true)}
            className="rounded-md p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
            aria-label="AI settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-stone-400">
              Ask about the researched spot database using your own AI provider. Try:
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-left text-sm text-stone-300 hover:border-emerald-700 hover:text-stone-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-8 bg-emerald-700/90 text-white"
                : "mr-4 bg-stone-800 text-stone-100"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && <div className="mr-4 rounded-lg bg-stone-800 px-3 py-2 text-sm text-stone-400">Thinking…</div>}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-stone-800 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasKey ? "Ask about camping spots…" : "Add an API key to start chatting…"}
          className="flex-1 rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>

      {showSettings && (
        <AISettingsModal
          initial={settings}
          onSave={save}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
