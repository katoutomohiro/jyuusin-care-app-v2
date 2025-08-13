// DEV限定: クリック遮蔽バイパス
if (import.meta.env.DEV) {
  const style = document.createElement('style');
  style.setAttribute('data-dev-overlay-bypass','');
  style.textContent = `*[data-overlay], .overlay, .click-blocker { pointer-events: none !important; }`;
  document.head.appendChild(style);
  console.log('overlay-bypass enabled');
}
