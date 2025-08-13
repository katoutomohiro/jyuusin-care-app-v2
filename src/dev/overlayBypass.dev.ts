// DEV限定: クリック遮蔽バイパス
if (import.meta.env.DEV && localStorage.getItem('devOverlayBypass') === '1') {
  const style = document.createElement('style');
  style.setAttribute('data-dev-overlay-bypass','');
  style.innerHTML = `.overlay, [data-overlay], .click-blocker, .modal-backdrop, .DialogOverlay { pointer-events:none!important; }`;
  document.head.appendChild(style);
  console.log('overlay-bypass enabled');
}
