"use strict";

/*
 * PDF export is loaded at page startup, while the Download button is created
 * dynamically when a reading is complete. We therefore wait for the button,
 * replace it with a clean clone (removing the legacy PDF click handler), and
 * attach the single source-of-truth exporter below.
 */
(function () {
    let installedButton = null;

    function escapeHtml(value) {
        return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    }

    function positionFor(entry) {
        if (entry.position === "Significator") {
            return {
                label: "Significator",
                description: "The card representing the person, matter, or central energy at the heart of the reading. It is drawn separately from the ten positions of the Cross."
            };
        }
        const spread = SPREADS[state.currentSpreadName];
        return spread ? spread.positions.find(position => position.label === entry.position) : null;
    }

    function buildReport() {
        document.getElementById("pdf-reading-report")?.remove();

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

        state.readingLog.forEach(entry => {
            const position = positionFor(entry);
            const interpretation = entry.interpretation || "";
            const item = document.createElement("article");
            item.className = "pdf-report-card";
            item.innerHTML = `
                <div class="pdf-card-copy">
                    <div class="pdf-card-position">${escapeHtml(position?.label || entry.position)}</div>
                    <h2>${escapeHtml(entry.card)}</h2>
                    <div class="pdf-card-orientation">${escapeHtml(entry.orientation)}</div>
                    ${position?.description ? `<p class="pdf-position-description">${escapeHtml(position.description)}</p>` : ""}
                    ${interpretation ? `<p class="pdf-card-interpretation">${escapeHtml(interpretation)}</p>` : ""}
                </div>
            `;
            cards.appendChild(item);
        });

        document.body.appendChild(report);
        return report;
    }

    function cleanup() {
        document.getElementById("pdf-reading-report")?.remove();
        document.getElementById("pdf-print-style")?.remove();
        if (installedButton) installedButton.disabled = false;
    }

    function printReading(button) {
        if (!state.readingLog.length) {
            window.alert("Reveal at least one card before downloading the reading.");
            return;
        }

        button.disabled = true;
        buildReport();

        const style = document.createElement("style");
        style.id = "pdf-print-style";
        style.textContent = `
            @media screen {
                #pdf-reading-report {
                    position: fixed !important;
                    left: -100000px !important;
                    top: 0 !important;
                    width: 8in !important;
                }
            }
            @media print {
                @page { size: Letter; margin: 0.6in; }
                html, body { background: #fff !important; color: #000 !important; }
                body > *:not(#pdf-reading-report) { display: none !important; }
                #pdf-reading-report {
                    display: block !important;
                    position: static !important;
                    width: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #fff !important;
                    color: #000 !important;
                    font-family: Georgia, "Times New Roman", serif;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .pdf-report-header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 18px;
                    margin-bottom: 24px;
                }
                .pdf-report-kicker,
                .pdf-report-header h1,
                .pdf-report-date,
                .pdf-report-card,
                .pdf-card-copy,
                .pdf-card-copy * {
                    color: #000 !important;
                    background: #fff !important;
                }
                .pdf-report-kicker { letter-spacing: 5px; font-size: 12px; }
                .pdf-report-header h1 { margin: 6px 0; font-size: 26px; }
                .pdf-report-date { font-size: 10px; }
                .pdf-report-card {
                    display: block;
                    padding: 18px 0 22px;
                    margin: 0;
                    border-bottom: 1px solid #999;
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                .pdf-card-position {
                    font-size: 11px;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .pdf-card-copy h2 { margin: 5px 0 3px; font-size: 21px; }
                .pdf-card-orientation { font-size: 11px; font-weight: bold; margin-bottom: 12px; }
                .pdf-card-copy p { font-size: 12px; line-height: 1.6; margin: 8px 0; }
                .pdf-position-description { font-style: italic; }
            }
        `;
        document.head.appendChild(style);
        window.addEventListener("afterprint", cleanup, { once: true });
        window.print();
        window.setTimeout(cleanup, 3000);
    }

    function installOnButton(button) {
        if (!button || button === installedButton) return;

        // The legacy exporter in reading-interpretations.js attaches its own
        // click handler. Replacing the node removes those listeners while
        // preserving the visible button and completion UI.
        const cleanButton = button.cloneNode(true);
        button.replaceWith(cleanButton);
        installedButton = cleanButton;
        cleanButton.addEventListener("click", () => printReading(cleanButton));
    }

    function scan() {
        const button = document.getElementById("download-reading-pdf");
        if (button && button !== installedButton) installOnButton(button);
    }

    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
