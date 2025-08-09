export async function unregisterSWInDev() {
  // Vite の型が未補完環境でも動くように any キャスト
  const isDev = (import.meta as any).env?.DEV;
  if (isDev && 'serviceWorker' in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        await r.unregister();
      }
      if (navigator.serviceWorker.controller) {
        try {
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        } catch {
          // ignore
        }
      }
      console.log('[dev] service worker unregistered');
    } catch (e) {
      console.warn('[dev] sw unregister failed', e);
    }
  }
}
