"use strict";

/*
 * Interpretation presentation layer.
 * The approved card layout is untouched. This file only moves the completed
 * interpretation text into the reading-log area below the separator.
 */
(function () {
    const currentCard = document.getElementById("current-card");
    const cardInterpretation = document.getElementById("card-interpretation");
    const readingLog = document.getElementById("reading-log");
    const menuScreen = document.getElementById("menu-screen");
    if (!currentCard || !cardInterpretation || !readingLog || !menuScreen) return;

    const entries = [];
    let lastKey = "";
    let readingActive = false;

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getCurrentInterpretation() {
        if (cardInterpretation.classList.contains("hidden")) return null;
        const title = document.getElementById("interpretation-title")?.textContent?.trim();
        const text = document.getElementById("interpretation-text")?.textContent?.trim();
        if (!title || !text) return null;
        return { title, text };
    }

    function captureCurrent() {
        const entry = getCurrentInterpretation();
        if (!entry) return false;
        const key = `${entry.title}|||${entry.text}`;
        if (key === lastKey) return false;
        entries.push(entry);
        lastKey = key;
        return true;
    }

    function render() {
        if (!entries.length) {
            readingLog.innerHTML = "";
            return;
        }
        readingLog.innerHTML = entries.map(entry => `
            <article class="reading-interpretation">
                <h3>${escapeHtml(entry.title)}</h3>
                <p>${escapeHtml(entry.text)}</p>
            </article>
        `).join("");
    }

    function clear() {
        entries.length = 0;
        lastKey = "";
        render();
    }

    /*
     * Capture phase is important: when the user taps an already-revealed card
     * to advance, app.js immediately replaces the current interpretation.
     * Capturing here first preserves the explanation before that happens.
     */
    currentCard.addEventListener("click", () => {
        captureCurrent();
        render();
        window.setTimeout(() => {
            const menuVisible = !menuScreen.classList.contains("hidden");
            if (menuVisible) {
                clear();
                readingActive = false;
                return;
            }
            readingActive = true;
            if (captureCurrent()) render();
        }, 30);
    }, true);

    /*
     * app.js changes the interpretation DOM synchronously during the reveal.
     * The observer catches those changes as an additional safety net, while
     * the delayed click handler above handles the normal path deterministically.
     */
    const observer = new MutationObserver(() => {
        if (!menuScreen.classList.contains("hidden")) {
            if (readingActive) clear();
            return;
        }
        if (captureCurrent()) render();
    });

    observer.observe(cardInterpretation, {
        attributes: true,
        attributeFilter: ["class", "aria-hidden"],
        childList: true,
        subtree: true,
        characterData: true
    });
})();
