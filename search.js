document.addEventListener("DOMContentLoaded", async () => {
    // =========================================================================
    // 1. EMBEDDED CSS STYLE GENERATOR
    // =========================================================================
    const styleBlock = document.createElement("style");
    styleBlock.textContent = `
        .forge-search-container {
            margin: 25px 0;
            max-width: 600px;
        }
        .forge-search-input {
            width: 100%;
            padding: 12px 16px;
            font-size: 16px;
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #333333;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            box-sizing: border-box;
        }
        .forge-search-input:focus {
            border-color: #00bc8c;
            box-shadow: 0 0 5px rgba(0, 188, 140, 0.3);
        }
        .app-list li {
            transition: opacity 0.15s ease;
        }
    `;
    document.head.appendChild(styleBlock);

    // =========================================================================
    // 2. RUNTIME HTML INTERFACE INJECTION
    // =========================================================================
    // Looks for your link container list automatically
    const appList = document.querySelector("ul") || document.querySelector("ol") || document.querySelector(".app-list");
    
    if (!appList) {
        console.error("Software-Forge Search Error: App list container element not found.");
        return;
    }

    // Build elements cleanly in system memory to maximize security
    const searchContainer = document.createElement("div");
    searchContainer.className = "forge-search-container";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "forge-search";
    searchInput.className = "forge-search-input";
    searchInput.placeholder = "Fuzzy search apps (tolerates typos)...";

    searchContainer.appendChild(searchInput);
    
    // Inject the generated search bar right above your list array block
    appList.parentNode.insertBefore(searchContainer, appList);

    // =========================================================================
    // 3. LEVENSHTEIN FUZZY MATCHING LOGIC
    // =========================================================================
    let searchData = [];

    // Pull your pre-compiled clean layout configuration data
    try {
        const response = await fetch("search_index.json");
        searchData = await response.json();
    } catch (err) {
        console.error("Software-Forge Search Error: Could not read search_index.json.");
        return;
    }

    // Mathematical Edit Distance function (Calculates typo proximity thresholds)
    function getEditDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        const costs = [];
        
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    // Monitor input changes to dynamically show or hide entries
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const listItems = appList.querySelectorAll("li");

        listItems.forEach((item, index) => {
            const appInfo = searchData[index];
            if (!appInfo) return; // Fallback validation safeguard

            const targetTitle = appInfo.title.toLowerCase();

            // Scenario A: Input field cleared out completely -> Show everything
            if (query === "") {
                item.style.display = "block";
                return;
            }

            // Scenario B: Exact match or clear partial match -> Skip distance check
            if (targetTitle.includes(query)) {
                item.style.display = "block";
                return;
            }

            // Scenario C: Evaluate character differences across strings and separate words
            const words = targetTitle.split(/\s+/);
            let closestDistance = 999;

            words.forEach(word => {
                const dist = getEditDistance(query, word);
                if (dist < closestDistance) closestDistance = dist;
            });
            
            const fullTitleDistance = getEditDistance(query, targetTitle);
            if (fullTitleDistance < closestDistance) closestDistance = fullTitleDistance;

            // Strict threshold constraints based on query string character depth
            const maxAllowedDistance = query.length <= 4 ? 2 : 3;

            if (closestDistance <= maxAllowedDistance) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});
