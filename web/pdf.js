"use strict";

(function () {
    const button = document.getElementById("download-reading-pdf");
    if (!button) return;

    function escapeHtml(value) {
        return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    }

    function positionFor(entry) {
        if (entry.position === "Significator") {
            return { label: "Significator", description: "The card representing the person, matter, or central energy at the heart of the reading." };
        }
        const spread = SPREADS[state.currentSpreadName];
        return spread ? spread.positions.find(position => position.label === entry.position) : null;
    }

    function interpretationFor(entry) {
        if (entry.position === "Significator") {
            return `${capitalize(cardTheme(entry.card, entry.orientation))}. As the Significator, this card represents the person, matter, or central energy at the heart of the reading.`;
        }
        const position = positionFor(entry);
        return position ? getInterpretation(state.currentSpreadId, position.id, entry.card, entry.orientation) : "";
    }

    function capitalize(value) {
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    }

    function buildReport() {
        const existing = document.getElementById("pdf-reading-report");
        if (existing) existing.remove();

        const report = document.createElement("section");
        report.id = "pdf-reading-report";
        report.innerHTML = `
            <div class="pdf-report-header">
                <div class="pdf-report-kicker">TAROT</div>
                <h1>${escapeHtml(state.currentSpreadName || "Tarot Reading")}</h1>
                <div class="pdf-report-date">${escapeHtml(new Date().toLocaleString())}</div>
            </div>
            <div class="pdf-report-cards"></div>
        `;
        const cards = report.querySelector(".pdf-report-cards");

        // Try to reuse the rendered interpretation text (the reading-log) when available.
        const renderedLog = document.getElementById("reading-log");
        const renderedEntries = renderedLog ? [...renderedLog.querySelectorAll(".reading-interpretation")].map(node => {
            const title = node.querySelector("h3")?.textContent?.trim() || "";
            const text = node.querySelector("p")?.textContent?.trim() || "";
            return { title, text };
        }) : [];

        function renderedTextFor(entry, position) {
            const expectedTitle = `${position?.label || entry.position} — ${entry.card} (${entry.orientation})`;
            const found = renderedEntries.find(e => e.title === expectedTitle);
            return found ? found.text : "";
        }

        state.readingLog.forEach(entry => {
            const position = positionFor(entry);
            // Prefer the captured/rendered interpretation text so the PDF matches what the user saw.
            const renderedText = renderedTextFor(entry, position);
            const interpretation = renderedText || interpretationFor(entry);
            const item = document.createElement("article");
            item.className = "pdf-report-card";
            item.innerHTML = `
                <div class="pdf-card-image-wrap">
                    <img class="pdf-card-image${entry.orientation === "Reversed" ? " pdf-card-reversed" : ""}" src="${escapeHtml(cardImagePath(entry.card))}" alt="${escapeHtml(entry.card)}">
                </div>
                <div class="pdf-card-copy">
                    <div class="pdf-card-position">${escapeHtml(position?.label || entry.position)}</div>
                    <h2>${escapeHtml(entry.card)}</h2>
                    <div class="pdf-card-orientation">${escapeHtml(entry.orientation)}</div>
                    ${position?.description ? `<p class="pdf-position-description">${escapeHtml(position.description)}</p>` : ""}
                    ${interpretation ? `<p>${escapeHtml(interpretation)}</p>` : ""}
                </div>
            `;
            cards.appendChild(item);
        });

        document.body.appendChild(report);
        return report;
    }

    async function waitForImages(report) {
        const images = [...report.querySelectorAll("img")];
        await Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
        })));
    }

    function cleanup() {
        document.getElementById("pdf-reading-report")?.remove();
        document.getElementById("pdf-print-style")?.remove();
        window.removeEventListener("afterprint", cleanup);
    }

    button.addEventListener("click", async () => {
        if (!state.readingLog.length) {
            window.alert("Reveal at least one card before downloading the reading.");
            return;
        }

        button.disabled = true;
        const report = buildReport();
        const style = document.createElement("style");
        style.id = "pdf-print-style";
        style.textContent = `
            @media print {
                @page { size: Letter; margin: 0.55in; }
                body > *:not(#pdf-reading-report) { display: none !important; }
                /* Ensure text prints as readable black and color adjustments are honored */
                #pdf-reading-report { display: block !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff; font-family: Georgia, "Times New Roman", serif; }
                .pdf-report-header { text-align: center; border-bottom: 2px solid #a98749; padding-bottom: 18px; margin-bottom: 22px; }
                .pdf-report-kicker { letter-spacing: 5px; font-size: 12px; color: #8a6a32; }
                .pdf-report-header h1 { margin: 6px 0; font-size: 28px; }
                .pdf-report-date { font-size: 11px; color: #000 !important; }
                .pdf-report-card { display: flex; gap: 22px; align-items: flex-start; padding: 18px 0; border-bottom: 1px solid #d5d0c6; break-inside: avoid; page-break-inside: avoid; }
                .pdf-card-image-wrap { width: 150px; flex: 0 0 150px; }
                .pdf-card-image { display: block; width: 150px; height: 255px; object-fit: contain; }
                .pdf-card-reversed { transform: rotate(180deg); }
                .pdf-card-copy { flex: 1; }
                /* Force black text for copy so it remains visible when printing */
                .pdf-card-copy, .pdf-card-copy p, .pdf-card-copy h2, .pdf-card-position, .pdf-card-orientation, .pdf-position-description { color: #000 !important; }
                .pdf-card-position { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; }
                .pdf-card-copy h2 { margin: 5px 0 3px; font-size: 21px; }
                .pdf-card-orientation { font-size: 11px; font-weight: bold; margin-bottom: 10px; }
                .pdf-card-copy p { font-size: 11px; line-height: 1.5; margin: 7px 0; }
                .pdf-position-description { color: #000 !important; }
            }
        `;
        document.head.appendChild(style);
        window.addEventListener("afterprint", cleanup, { once: true });
        await waitForImages(report);
        window.print();
        window.setTimeout(() => { cleanup(); button.disabled = false; }, 2000);
    });
})();
