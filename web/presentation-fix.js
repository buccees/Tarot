"use strict";

/*
 * Final interpretation renderer.
 *
 * The card UI and reading engine remain untouched. This file creates one
 * dedicated results container that the reading engine never clears. Each
 * completed interpretation is copied into that container in draw order.
 */
(function () {
    const cardInterpretation = document.getElementById("card-interpretation");
    const instruction = document.getElementById("instruction");
    const menuScreen = document.getElementById("menu-screen");
    const readingScreen = document.getElementById("reading-screen");

    if (!cardInterpretation || !instruction || !menuScreen || !readingScreen) return;

    let results = document.getElementById("reading-results");
    if (!results) {
        results = document.createElement("section");
        results.id = "reading-results";
        results.setAttribute("aria-live", "polite");
        results.style.width = "100%";
        results.style.maxWidth = "900px";
        results.style.margin = "0 auto";
        results.style.padding = "0 8px 30px";
        results.style.color = "#c7c7c7";
        results.style.textAlign = "left";
        instruction.insertAdjacentElement("afterend", results);
    }

    const entries = [];
    let lastKey = "";
    let captureQueued = false;

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

        const titleElement = document.getElementById("interpretation-title");
        const textElement = document.getElementById("interpretation-text");
        const title = titleElement ? titleElement.textContent.trim() : "";
        const text = textElement ? textElement.textContent.trim() : "";

        if (!title || !text) return null;
        return { title, text };
    }

    function capture() {
        if (!menuScreen.classList.contains("hidden")) return;

        const interpretation = getCurrentInterpretation();
        if (!interpretation) return;

        const key = `${interpretation.title}|||${interpretation.text}`;
        if (key === lastKey) return;

        entries.push(interpretation);
        lastKey = key;
        render();
    }

    function render() {
        results.innerHTML = entries.map((entry) => `
            <article class="reading-interpretation" style="color:#c7c7c7;border-top:1px solid rgba(199,199,199,.35);padding:20px 8px 22px;margin:0;">
                <h3 style="color:#c7c7c7;margin:0 0 12px;font-size:1.05rem;line-height:1.35;font-weight:700;">${escapeHtml(entry.title)}</h3>
                <p style="color:#c7c7c7;margin:0;font-size:1rem;line-height:1.75;font-weight:400;white-space:normal;">${escapeHtml(entry.text)}</p>
            </article>
        `).join("");
    }

    function reset() {
        entries.length = 0;
        lastKey = "";
        results.innerHTML = "";
    }

    function queueCapture() {
        if (captureQueued) return;
        captureQueued = true;
        window.setTimeout(() => {
            captureQueued = false;
            if (menuScreen.classList.contains("hidden")) capture();
            else reset();
        }, 0);
    }

    const interpretationObserver = new MutationObserver(queueCapture);
    interpretationObserver.observe(cardInterpretation, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class"]
    });

    const screenObserver = new MutationObserver(() => {
        if (!menuScreen.classList.contains("hidden")) reset();
    });
    screenObserver.observe(menuScreen, { attributes: true, attributeFilter: ["class"] });

    instruction.addEventListener("click", queueCapture);
    window.setTimeout(queueCapture, 0);
})();
