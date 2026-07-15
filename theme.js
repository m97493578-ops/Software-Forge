(function() {
  // 1. Define and inject the CSS rules into the document head
  const css = `
    :root {
      --bg-color: #ffffff;
      --text-color: #24292f;
      --btn-bg: #f6f8fa;
    }
    body.dark-theme {
      --bg-color: #0d1117;
      --text-color: #c9d1d9;
      --btn-bg: #21262d;
    }
    body {
      background-color: var(--bg-color) !important;
      color: var(--text-color) !important;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .theme-btn {
      background-color: var(--btn-bg);
      color: var(--text-color);
      border: 1px solid rgba(27, 31, 36, 0.15);
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
    }
    body.dark-theme .theme-btn { border-color: rgba(240, 246, 252, 0.1); }
    body.dark-theme .icon-dark { display: none; }
    body:not(.dark-theme) .icon-light { display: none; }
  `;

  const styleTag = document.createElement('style');
  styleTag.appendChild(document.createTextNode(css));
  document.head.appendChild(styleTag);

  // 2. Check local storage and apply dark mode immediately before page render
  const savedTheme = localStorage.getItem('site-theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // 3. Set up click behavior when the HTML elements finish loading
  document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
      });
    }
  });
})();
