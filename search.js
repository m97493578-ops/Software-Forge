document.addEventListener("DOMContentLoaded", async () => {
    // =========================================================================
    // 1. EMBEDDED CSS STYLE GENERATOR
    // =========================================================================
    const styleBlock = document.createElement("style");
    styleBlock.textContent = `
        .forge-search-container {
            margin: 25px 0 10px 0;
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
            box-sizing: border-box;
        }
        .forge-search-input:focus {
            border-color: #00bc8c;
            box-shadow: 0 0 5px rgba(0, 188, 140, 0.3);
        }
        .forge-results-wrapper {
            margin: 15px 0 25px 0;
            display: block; /* Forces block execution layout */
            clear: both;
        }
        .forge-search-result-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #222;
            display: block;
        }
        .forge-result-title {
            font-size: 18px;
            font-weight: bold;
            color: #00bc8c;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 5px;
        }
        .forge-result-title:hover {
            text-decoration: underline;
        }
        .forge-result-desc {
            font-size: 14px;
            color: #aaaaaa;
            margin: 0;
            line-height: 1.5;
            display: block;
        }
    `;
    document.head.appendChild(styleBlock);

    // =========================================================================
    // 2. INTERFACE & WRAPPER INJECTION
    // =========================================================================
    const targetHeader = document.querySelector("h3") || document.getElementById("available-deployments");
    if (!targetHeader) return;

    // Create Search Bar
    const searchContainer = document.createElement("div");
    searchContainer.className = "forge-search-container";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "forge-search";
    searchInput.className = "forge-search-input";
    searchInput.placeholder = "Search apps...";

    searchContainer.appendChild(searchInput);
    targetHeader.parentNode.insertBefore(searchContainer, targetHeader.nextSibling);

    // Create a block-level results wrapper right after the search input container
    const resultsWrapper = document.createElement("div");
    resultsWrapper.className = "forge-results-wrapper";
    searchContainer.parentNode.insertBefore(resultsWrapper, searchContainer.nextSibling);

    // Grab all current apps from your bold markdown text blocks
    const paragraphItems = document.querySelectorAll("p strong a");
    const appElementsData = [];

    paragraphItems.forEach((anchor) => {
        const parentParagraph = anchor.closest("p");
        if (!parentParagraph) return;

        const linkHref = anchor.getAttribute("href") || "";
        if (linkHref.includes("App2.html") || linkHref.includes("index.html")) return;

        const appName = anchor.textContent.trim();
        
        // Dynamic description catcher: grabs text or sets a default
        let appDescription = "Independent portable software utility build compiled for Software-Forge.";
        if (parentParagraph.nextElementSibling && parentParagraph.nextElementSibling.tagName === "P") {
            appDescription = parentParagraph.nextElementSibling.textContent.trim();
        }

        appElementsData.push({
            name: appName,
            url: linkHref,
            description: appDescription,
            originalElement: parentParagraph
        });
    });

    // =========================================================================
    // 3. LEVENSHTEIN DISTANCE FUZZY ENGINE
    // =========================================================================
    function getEditDistance(s1, s2) {
        s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) costs[j] = j;
                else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue; lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    // =========================================================================
    // 4. DYNAMIC SEARCH INPUT EVENT
    // =========================================================================
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Clear previous results block entirely
        resultsWrapper.innerHTML = "";

        // If search box is empty, show original links and let page structure settle naturally
        if (query === "") {
            appElementsData.forEach(app => {
                app.originalElement.style.display = "block";
            });
            return;
        }

        // Hide default static app listings completely so they don't block structural layout flow
        appElementsData.forEach(app => {
            app.originalElement.style.display = "none";
        });

        // Evaluate matches
        appElementsData.forEach(app => {
            const targetTitle = app.name.toLowerCase();
            let isMatch = false;

            if (targetTitle.includes(query)) {
                isMatch = true;
            } else {
                const words = targetTitle.split(/\s+/);
                let closestDistance = 999;

                words.forEach(word => {
                    const dist = getEditDistance(query, word);
                    if (dist < closestDistance) closestDistance = dist;
                });

                const fullTitleDistance = getEditDistance(query, targetTitle);
                if (fullTitleDistance < closestDistance) closestDistance = fullTitleDistance;

                const maxAllowedDistance = query.length <= 4 ? 2 : 3;
                if (closestDistance <= maxAllowedDistance) {
                    isMatch = true;
                }
            }

            // Generate block results that naturally expand and push down the text below it
            if (isMatch) {
                const resultItem = document.createElement("div");
                resultItem.className = "forge-search-result-item";

                const resultLink = document.createElement("a");
                resultLink.className = "forge-result-title";
                resultLink.href = app.url;
                resultLink.textContent = app.name;

                const resultDesc = document.createElement("p");
                resultDesc.className = "forge-result-desc";
                resultDesc.textContent = app.description;

                resultItem.appendChild(resultLink);
                resultItem.appendChild(resultDesc);
                resultsWrapper.appendChild(resultItem);
            }
        });
    });
});
