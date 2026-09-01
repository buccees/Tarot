"use strict";

/*
 * Interpretation presentation bridge.
 * The approved card layout is untouched. The app writes the card state and
 * interpretation into #card-interpretation, then refreshReadingLog() can
 * immediately rewrite #reading-log. A MutationObserver captures the finished
 * interpretation and restores it below the card in draw order after the app
 * has completed its own DOM update.
 */
(function () {
    const cardInterpretation = document.getElementById("card-interpretation");
    const readingLog = document.getElementById("reading-log");
    const readingScreen = document.getElementById("reading-screen");
    const menuScreen = document.getElementById("menu-screen");
    if (!cardInterpretation || !readingLog || !readingScreen || !menuScreen) return;

    const entries = [];
    let lastKey = "";
    let rendering = false;

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function capture() {
        if (menuScreen.classList.contains("hidden") === false) return;
        if (cardInterpretation.classList.contains("hidden")) return;

        const title = document.getElementById("interpretation-title")?.textContent?.trim();
        const text = document.getElementById("interpretation-text")?.textContent?.trim();
        if (!title || !text) return;

        const key = `${title}|||${text}`;
        if (key === lastKey) return;
        entries.push({ title, text });
        lastKey = key;
    }

    function render() {
        if (rendering) return;
        if (!entries.length) return;
        rendering = true;

        /* Preserve the app's card-draw log and append the explanations. */
        const existing = Array.from(readingLog.querySelectorAll(".reading-entry"))
            .map(node => node.outerHTML).join("");

        const explanations = entries.map(entry => `
            <article class="reading-interpretation" style="color:#c7c7c7;text-align:left;margin:22px 0 0;padding:20px 8px;border-top:1px solid rgba(199,199,199,.35);">
                <h3 style="color:#c7c7c7;margin:0 0 12px;font-size:1.05rem;line-height:1.35;">${escapeHtml(entry.title)}</h3>
                <p style="color:#c7c7c7;margin:0;line-height:1.75;font-size:1rem;white-space:normal;">${escapeHtml(entry.text)}</p>
            </article>
        `).join("");

        readingLog.innerHTML = `${existing}${explanations}`;
        rendering = false;
    }

    function resetIfMenuVisible() {
        if (!menuScreen.classList.contains("hidden")) {
            entries.length = 0;
            lastKey = "";
            readingLog.innerHTML = "";
        }
    }

    const observer = new MutationObserver(() => {
        if (rendering) return;
        if (!menuScreen.classList.contains("hidden")) {
            resetIfMenuVisible();
            return;
        }
        capture();
        render();
    });

    observer.observe(cardInterpretation, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class"] });
    observer.observe(readingLog, { childList: true, subtree: true });

    /* Ensure the bridge is active immediately after deployment as well. */
    window.setTimeout(() => {
        capture();
        render();
    }, 0);
})();
