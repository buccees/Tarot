"use strict";

/*
 * Presentation layer for completed interpretations.
 * The existing reading engine owns the cards and positions. This layer keeps
 * the full contextual interpretation for each revealed card and renders it
 * beneath the separator line, in the exact order the cards were revealed.
 */
(function () {
    const currentCard = document.getElementById("current-card");
    const cardInterpretation = document.getElementById("card-interpretation");
    const readingLog = document.getElementById("reading-log");
    if (!currentCard || !cardInterpretation || !readingLog) return;

    const entries = [];
    let lastCapturedKey = "";

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function captureVisibleInterpretation() {
        if (cardInterpretation.classList.contains("hidden")) return;

        const title = document.getElementById("interpretation-title")?.textContent?.trim();
        const text = document.getElementById("interpretation-text")?.textContent?.trim();
        if (!title || !text) return;

        const key = `${title}|||${text}`;
        if (key === lastCapturedKey) return;

        entries.push({ title, text });
        lastCapturedKey = key;
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

    function resetIfBackAtMenu() {
        const menu = document.getElementById("menu-screen");
        if (menu && !menu.classList.contains("hidden")) {
            entries.length = 0;
            lastCapturedKey = "";
            render();
        }
    }

    /* Capture the completed card before the reading engine advances it. */
    currentCard.addEventListener("click", captureVisibleInterpretation, true);

    /* Capture the newly revealed card after the reading engine has populated it. */
    currentCard.addEventListener("click", () => {
        window.setTimeout(() => {
            captureVisibleInterpretation();
            render();
            resetIfBackAtMenu();
        }, 0);
    });
})();
