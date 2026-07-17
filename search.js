document.addEventListener("DOMContentLoaded", async () => {
    // =========================================================================
    // 1. HARDENED FLOATING LAYOUT STYLING
    // =========================================================================
    const styleBlock = document.createElement("style");
    styleBlock.textContent = `
        .forge-search-container {
            margin: 25px 0 10px 0;
            max-width: 600px;
            position: relative !important;
            display: block !important;
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
        /* FLOATING RESULTS PANEL: Completely ignores static layout restrictions */
        .forge-results-dropdown {
            position: absolute !important;
            top: 105% !important;
            left: 0 !important;
            width: 100% !important;
            background-color: #161616 !important;
            border: 1px solid #333333 !important;
            border-radius: 6px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7) !important;
            z-index: 99999 !important; /* Forces it to stay on top of everything else */
            max-height: 400px !important;
            overflow-y: auto !important;
            display: none; /* Hidden by default */
            padding: 10px 15px !important;
            box-sizing: border-box !important;
        }
        .forge-search-result-item {
            padding: 12px 5px !important;
            border-bottom: 1px solid #222222 !important;
            display: block !important;
        }
        .forge-search-result-item:last-child {
            border-bottom: none !important;
        }
        .forge-result-title {
            font-size: 16px;
            font-weight: bold;
            color: #00bc8c !important;
            text-decoration: none;
            display: inline-block !important;
            margin-bottom: 3px !important;
        }
        .forge-result-title:hover {
            text-decoration: underline !important;
        }
        .forge-result-desc {
            font-size: 13px;
            color: #aaaaaa !important;
            margin: 0 !important;
            line-height: 1.4 !important;
            display: block !important;
        }
    `;
    document.head.appendChild(styleBlock);

    // =========================================================================
    // 2. RUNTIME DOM PANEL INJECTION
    // =========================================================================
    const targetHeader = document.querySelector("h3") || document.getElementById("available-deployments");
    if (!targetHeader) return;

    // Create Search Container wrapper
    const searchContainer = document.createElement("div");
    searchContainer.className = "forge-search-container";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "forge-search";
    searchInput.className = "forge-search-input";
    searchInput.placeholder = "Search apps...";

    // Create the Floating Menu panel
    const resultsDropdown = document.createElement("div");
    resultsDropdown.className = "forge-results-dropdown";

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(resultsDropdown);
    targetHeader.parentNode.insertBefore(searchContainer, targetHeader.nextSibling);

    // Gather application data from your existing bold nodes
    const paragraphItems = document.querySelectorAll("p strong a");
    const appElementsData = [];

    paragraphItems.forEach((anchor) => {
        const parentParagraph = anchor.closest("p");
        if (!parentParagraph) return;

        const linkHref = anchor.getAttribute("href") || "";
        if (linkHref.includes("App2.html") || linkHref.includes("index.html")) return;

        const appName = anchor.textContent.trim();
        
        let appDescription = "Independent portable software utility build compiled for Software-Forge.";
        if (parentParagraph.nextElementSibling && parentParagraph.nextElementSibling.tagName === "P") {
            appDescription = parentParagraph.nextElementSibling.textContent.trim();
        }

        appElementsData.push({
            name: appName,
            url: linkHref,
            description: appDescription
        });
    });

    // =========================================================================
    // 3. LEVENSHTEIN FUZZY MATCH ENGINE
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
    // 4. FLOATING INTERACTION LOGIC
    // =========================================================================
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Clear panel frame rows
        resultsDropdown.innerHTML = "";

        // If field is empty, hide the dropdown frame entirely
        if (query === "") {
            resultsDropdown.style.display = "none";
            return;
        }

        let matchCount = 0;

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

            // Build rows into floating panel interface frame if match triggers true
            if (isMatch) {
                matchCount++;
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
                resultsDropdown.appendChild(resultItem);
            }
        });

        // Unveil dropdown if entries match, hide if list is zero
        if (matchCount > 0) {
            resultsDropdown.style.display = "block";
        } else {
            // Optional: Show a quick "No results found" line
            resultsDropdown.innerHTML = '<p style="margin:5px 0; color:#666; font-size:14px;">No apps found.</p>';
            resultsDropdown.style.display = "block";
        }
    });

    // Close the floating search drop panel instantly if you click anywhere else on screen
    document.addEventListener("click", (e) => {
        if (!searchContainer.contains(e.target)) {
            resultsDropdown.style.display = "none";
        }
    });
});
