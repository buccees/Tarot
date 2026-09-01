"use strict";

/*
 * Reading presentation bridge.
 * The card artwork/layout stays untouched. This bridge watches the existing
 * interpretation fields after app.js resolves a card and places each
 * completed, position-specific explanation into the existing silver
 * reading area below the card.
 */
(function () {
    const cardInterpretation = document.getElementById("card-interpretation");
    const readingLog = document.getElementById("reading-log");
    const menuScreen = document.getElementById("menu-screen");
    if (!cardInterpretation || !readingLog || !menuScreen) return;

    const entries = [];
    let lastKey = "";
    let readingWasActive = false;

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function render() {
        readingLog.innerHTML = entries.map(entry => `
            <article class="reading-interpretation">
                <h3>${escapeHtml(entry.title)}</h3>
                <p>${escapeHtml(entry.text)}</p>
            </article>
        `).join("");
    }

    function clearReading() {
        entries.length = 0;
        lastKey = "";
        render();
    }

    function capture() {
        if (cardInterpretation.classList.contains("hidden")) return;
        const title = document.getElementById("interpretation-title")?.textContent?.trim();
        const text = document.getElementById("interpretation-text")?.textContent?.trim();
        if (!title || !text) return;

        const key = `${title}|||${text}`;
        if (key === lastKey) return;
        entries.push({ title, text });
        lastKey = key;
        render();
    }

    const observer = new MutationObserver(() => {
        const menuVisible = !menuScreen.classList.contains("hidden");
        if (menuVisible) {
            if (readingWasActive) clearReading();
            readingWasActive = false;
            return;
        }
        readingWasActive = true;
        window.setTimeout(capture, 0);
    });

    observer.observe(cardInterpretation, { attributes: true, attributeFilter: ["class", "aria-hidden"], childList: true, subtree: true, characterData: true });
    observer.observe(menuScreen, { attributes: true, attributeFilter: ["class"] });
})();
