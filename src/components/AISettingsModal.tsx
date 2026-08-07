"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PROVIDERS, getProvider, type ProviderId } from "@/lib/ai-providers";
import type { AISettings } from "@/lib/use-ai-settings";

export function AISettingsModal({
  initial,
  onSave,
  onClose,
}: {
  initial: AISettings;
  onSave: (settings: AISettings) => void;
  onClose: () => void;
}) {
  const [provider, setProvider] = useState<ProviderId>(initial.provider);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [model, setModel] = useState(initial.model);
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);

  const cfg = getProvider(provider);

  function handleProviderChange(next: ProviderId) {
    setProvider(next);
    const nextCfg = getProvider(next);
    if (nextCfg.defaultModel) setModel(nextCfg.defaultModel);
  }

  function handleSave() {
    onSave({ provider, apiKey: apiKey.trim(), model: model.trim(), baseUrl: baseUrl.trim() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-stone-700 bg-stone-900 p-5 text-stone-100 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Trail Guide Settings</h2>
          <button onClick={onClose} aria-label="Close" className="text-stone-400 hover:text-stone-100">
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm text-stone-400">
          Bring your own API key from any supported provider. Your key is sent only to your chosen
          provider through our server proxy for each request — it is stored in your browser
          (localStorage) only, never saved on our servers.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Provider</label>
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as ProviderId)}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-sm"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {cfg.needsBaseUrl && (
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-300">Base URL</label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com/v1/chat/completions"
                className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={cfg.keyPlaceholder}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-sm"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Model</label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={cfg.modelHint}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-stone-500">{cfg.modelHint}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-stone-300 hover:bg-stone-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || !model.trim()}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
