// DEV限定: クリック遮蔽バイパス
if (import.meta.env.DEV && localStorage.getItem('devOverlayBypass') === '1') {
  const style = document.createElement('style');
  style.setAttribute('data-dev-overlay-bypass','');
  style.textContent = `*[data-overlay], .overlay, .click-blocker { pointer-events: none !important; }`;
  document.head.appendChild(style);
  console.log('overlay-bypass enabled');

  // 以前の pointer-events:none を適用
  document.body.style.pointerEvents = 'none';
  document.body.style.opacity = '0.5';
}
