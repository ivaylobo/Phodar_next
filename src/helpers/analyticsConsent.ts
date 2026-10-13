import { useSyncExternalStore } from 'react';

const KEY = 'cookies-accepted';
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-0R3EVNK6EG';

function readConsent(): boolean {
  try { return window.localStorage.getItem(KEY) === 'true'; } catch { return false; }
}
function subscribe(callback: () => void) {
  // The existing popup writes localStorage without dispatching an event.
  // Storage events cover other tabs; polling detects acceptance in this tab.
  const interval = window.setInterval(callback, 500);
  window.addEventListener('storage', callback);
  window.addEventListener('focus', callback);
  return () => {
    window.clearInterval(interval);
    window.removeEventListener('storage', callback);
    window.removeEventListener('focus', callback);
  };
}
export function useAnalyticsConsent() {
  return useSyncExternalStore(subscribe, readConsent, () => false);
}
