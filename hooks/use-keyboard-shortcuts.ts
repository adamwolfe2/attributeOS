"use client";

import { useEffect, useCallback } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

type Shortcuts = {
  [key: string]: ShortcutHandler;
};

export function useKeyboardShortcuts(shortcuts: Shortcuts, enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Build shortcut key string
      const parts: string[] = [];
      if (event.ctrlKey) parts.push("ctrl");
      if (event.metaKey) parts.push("cmd");
      if (event.altKey) parts.push("alt");
      if (event.shiftKey) parts.push("shift");

      // Add the actual key
      const key = event.key.toLowerCase();
      if (!["control", "meta", "alt", "shift"].includes(key)) {
        parts.push(key);
      }

      const shortcutKey = parts.join("+");

      // Check if this shortcut exists
      const handler = shortcuts[shortcutKey];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}
