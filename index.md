<!-- --- START SELF-CONTAINED DARK MODE TOGGLE --- -->
<div class="theme-toggle-container">
  <button id="theme-toggle" aria-label="Toggle dark mode" class="theme-btn">
    <span class="icon-light">☀️ Light Mode</span>
    <span class="icon-dark">🌙 Dark Mode</span>
  </button>

  <style>
    /* 1. Define Light and Dark Variables */
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

    /* 2. Overwrite your global body styles using variables */
    body {
      background-color: var(--bg-color) !important;
      color: var(--text-color) !important;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    /* 3. Button Styles */
    .theme-toggle-container {
      padding: 10px;
    }
    .theme-btn {
      background-color: var(--btn-bg);
      color: var(--text-color);
      border: 1px solid rgba(27, 31, 36, 0.15);
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
    }
    body.dark-theme .theme-btn {
      border-color: rgba(240, 246, 252, 0.1);
    }

    /* 4. Show/Hide Icons based on mode */
    body.dark-theme .icon-dark { display: none; }
    body:not(.dark-theme) .icon-light { display: none; }
  </style>

  <script>
    (function() {
      const btn = document.getElementById('theme-toggle');
      // Look for a saved preference, otherwise default to user's system setting
      const savedTheme = localStorage.getItem('site-theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

      // Instantly apply the correct theme on page render
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
      }

      // Handle the button click event
      btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
      });
    })();
  </script>
</div>
<!-- --- END SELF-CONTAINED DARK MODE TOGGLE --- -->


## Independent Open Source Projects

Welcome to my independent web platform hosted safely outside corporate walls. I build native, local utilities designed to maximize user control, preserve digital data, make apps portable, and keep machine computing highly efficient.
Want to help build more portable tools like this? Download these two tools **[Tools To Make Custom Apps](Tools-To-Make-Custom-Apps.md)** to generate your own launcher and installer You Must Follow This LICENSE File: [LICENSE](LICENSE.md)

### Site Pages
* **[👉 Explore All Apps](App.md)**
* **[Visit The Forums](Fourm.md)**

---
© 2026 Free Software Commons. Developed independently.
