"use client";

import { useCallback, useEffect, useState } from "react";
import { PROVIDERS, type ProviderId } from "./ai-providers";

export interface AISettings {
  provider: ProviderId;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const STORAGE_KEY = "backcountry-releases:ai-settings";

function defaultsFor(provider: ProviderId): AISettings {
  const cfg = PROVIDERS.find((p) => p.id === provider)!;
  return { provider, apiKey: "", model: cfg.defaultModel, baseUrl: "" };
}

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>(() => defaultsFor("anthropic"));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount (SSR has no window); this is
    // the one-time browser->React sync this effect exists for.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSettings(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  const save = useCallback((next: AISettings) => {
    setSettings(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode etc.) — settings still work in-memory for this session
    }
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSettings(defaultsFor("anthropic"));
  }, []);

  const hasKey = settings.apiKey.trim().length > 0;

  return { settings, save, clear, loaded, hasKey };
}
