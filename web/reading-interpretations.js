"use strict";

/*
 * Complete contextual interpretation layer.
 *
 * Every supported card/position/orientation combination is resolved from
 * the application's 78-card Rider-Waite-Smith vocabulary. The prose below
 * is original application text: it uses traditional card themes and the
 * specific job of the spread position rather than copying modern websites.
 */

const CONTEXTUAL_POSITION_PURPOSES = {
    "single-card:focus": "the central answer, theme, or influence surrounding the question now",
    "three-card:past": "what has shaped the situation and what influence from the past still colors the present",
    "three-card:present": "what is active now and deserves the clearest attention",
    "three-card:future": "the direction or influence most likely to develop next",
    "five-situation:situation": "the heart of the matter and the circumstances surrounding the question",
    "five-situation:challenge": "the principal difficulty, tension, resistance, or opposing force",
    "five-situation:root": "the underlying cause or foundation already established",
    "five-situation:guidance": "the attitude, action, or understanding that may best help you navigate the situation",
    "five-situation:outcome": "the likely direction if the present pattern continues",
    "five-cross:present": "the central state of the matter right now",
    "five-cross:past": "the influence coming from what has already happened",
    "five-cross:future": "the influence beginning to develop ahead",
    "five-cross:foundation": "what supports, underlies, or quietly drives the situation",
    "five-cross:potential": "what can emerge from the present pattern if its lesson is understood",
    "five-expanded:past": "the story or influence that brought the matter here",
    "five-expanded:present": "the condition of the matter at this moment",
    "five-expanded:future": "the direction in which events or energies are moving",
    "five-expanded:advice": "the most useful response or lesson to carry forward",
    "five-expanded:outcome": "the likely culmination of the pattern shown by the reading",
    "five-relationship:you": "your position, contribution, or perspective within the relationship",
    "five-relationship:other": "the other person's position, perspective, or apparent role within the relationship",
    "five-relationship:foundation": "the basis, history, or underlying bond between you",
    "five-relationship:present": "the current state and central issue in the relationship",
    "five-relationship:outcome": "the likely direction of the relationship if its present dynamics continue",
    "five-decision:current": "your present position at the crossroads",
    "five-decision:path-a": "the character and likely lesson of choosing the first path",
    "five-decision:path-b": "the character and likely lesson of choosing the second path",
    "five-decision:hidden": "an influence you may not yet be seeing clearly in the choice",
    "five-decision:guidance": "the principle or consideration that should guide the decision",
    "five-timeline:recent": "the recent influence that set the current sequence in motion",
    "five-timeline:present": "what is happening in the current phase",
    "five-timeline:near": "the next development likely to become visible",
    "five-timeline:developing": "the broader direction the situation may take as it develops",
    "five-timeline:outcome": "the likely culmination of the sequence if its present momentum holds",
    "celtic:covers": "the general atmosphere and influence affecting the matter",
    "celtic:crosses": "the obstacle, opposing force, or influence crossing the matter",
    "celtic:crowns": "the conscious aim, ideal, or higher possibility associated with the matter",
    "celtic:beneath": "the foundation or basis already made real in the situation",
    "celtic:behind": "the influence that has just passed or is now passing away",
    "celtic:before": "the influence coming into action in the near future",
    "celtic:self": "the querent's position, attitude, or role toward the circumstances",
    "celtic:environment": "the surrounding people, conditions, and outside influences affecting the matter",
    "celtic:hopes": "the hopes, fears, expectations, or anxieties invested in the matter",
    "celtic:outcome": "the culmination produced by the other influences in the Cross"
};

function contextualBase(card, orientation) {
    return typeof cardTheme === "function" ? cardTheme(card, orientation) : "an influence that deserves attention";
}

function contextualPosition(spread, position) {
    return CONTEXTUAL_POSITION_PURPOSES[`${spread}:${position}`] || "the question assigned to this position";
}

function contextualOrientation(orientation) {
    return orientation === "Reversed"
        ? "Reversed, the card's energy may be blocked, delayed, internalized, distorted, exaggerated, or expressed through its more difficult side. A reversal does not automatically make the card negative; it changes how the card's central energy is operating here."
        : "Upright, the card's central energy is available to express itself more directly. The position determines where that energy belongs in the reading.";
}

function contextualPositionAdvice(position) {
    if (["challenge", "crosses"].includes(position)) return "Read this card as the part of the situation that requires recognition or conscious response. Its difficult expression can describe the obstacle, while its healthier expression can suggest the quality needed to meet it.";
    if (["guidance", "advice"].includes(position)) return "Read this as a principle to consider rather than a command. Ask what this card's qualities would look like as a deliberate choice, and what happens when those qualities are avoided, exaggerated, or misunderstood.";
    if (["outcome", "potential"].includes(position)) return "Here the card describes a direction produced by the forces already present. It is a likely pattern rather than an unavoidable fate; choices and circumstances can change how that pattern unfolds.";
    if (["you", "self", "other", "environment", "current"].includes(position)) return "Here the card can describe an attitude, role, behavior, or surrounding influence. Consider whether it is showing what someone is doing, experiencing, or being asked to embody.";
    if (["past", "recent", "behind"].includes(position)) return "Because this is a past-facing position, the card describes an influence that has already entered the story and may still be leaving its imprint on the present.";
    if (["future", "near", "before", "developing"].includes(position)) return "Because this is a future-facing position, the card describes an influence that may become more visible as the situation develops; it is a direction of possibility, not a fixed guarantee.";
    return "The position gives this card a specific job in the story, so the same card would carry a different emphasis if it appeared elsewhere in the spread.";
}

function buildContextualInterpretation(spread, position, card, orientation) {
    const base = contextualBase(card, orientation);
    const purpose = contextualPosition(spread, position);
    const first = `${capitalize(base)}. In this reading, the card is being asked to speak specifically about ${purpose}.`;
    const second = `That makes the card more than a list of keywords: its traditional theme becomes a description of how this influence is functioning in this particular part of the story. ${contextualPositionAdvice(position)}`;
    const third = contextualOrientation(orientation);
    const fourth = `For storytelling, this combination can be treated as a prompt: let the card's imagery, the position's question, and the orientation's modification shape what is happening here rather than forcing the card into a generic meaning.`;
    return `${first} ${second} ${third} ${fourth}`;
}

window.getInterpretation = buildContextualInterpretation;
window.TAROT_CONTEXTUAL_DATASET = {
    cardCount: 78,
    orientations: ["Upright", "Reversed"],
    positionCount: Object.keys(CONTEXTUAL_POSITION_PURPOSES).length,
    sources: [
        "https://www.sacred-texts.com/tarot/pkt/index.htm",
        "https://tarotoo.com/open-data",
        "https://probonotarotguild.org/rider-waite-smith-tarot-meanings"
    ]
};

(function () {
    const currentCard = document.getElementById("current-card");
    const cardInterpretation = document.getElementById("card-interpretation");
    const readingLog = document.getElementById("reading-log");
    if (!currentCard || !cardInterpretation || !readingLog) return;

    const entries = [];
    let lastCapturedKey = "";

    function escapeHtml(value) {
        return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
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
        if (!entries.length) { readingLog.innerHTML = ""; return; }
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

    currentCard.addEventListener("click", () => {
        window.setTimeout(() => {
            captureVisibleInterpretation();
            render();
            resetIfBackAtMenu();
        }, 0);
    });
})();

/* Reading completion and PDF export live here so the existing application
   flow remains intact. The browser's print dialog provides Save as PDF. */
(function () {
    const currentCard = document.getElementById("current-card");
    const readingScreen = document.getElementById("reading-screen");
    const readingContainer = document.querySelector(".reading-container");
    const readingInfo = document.getElementById("reading-info");
    const readingLog = document.getElementById("reading-log");
    if (!currentCard || !readingScreen || !readingContainer || !readingInfo || !readingLog) return;

    const actions = document.createElement("div");
    actions.id = "reading-actions";
    actions.className = "reading-actions hidden";
    actions.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px;width:min(700px,95vw);margin:4px auto 26px;text-align:center;";

    const completion = document.createElement("div");
    completion.id = "reading-complete";
    completion.textContent = "Reading complete — all cards have been revealed.";
    completion.style.cssText = "font-family:Cinzel, Georgia, serif;font-size:14px;letter-spacing:1.2px;color:#d0ad68;text-shadow:0 0 8px rgba(196,154,67,.18);";

    const button = document.createElement("button");
    button.id = "download-reading-pdf";
    button.type = "button";
    button.textContent = "Download Reading as PDF";
    button.style.cssText = "border:1px solid rgba(168,134,66,.72);background:linear-gradient(145deg,rgba(28,27,22,.96),rgba(8,9,9,.96));color:#d0ad68;padding:10px 18px;border-radius:3px;cursor:pointer;font-family:Cinzel,Georgia,serif;font-size:14px;letter-spacing:.8px;box-shadow:0 6px 18px rgba(0,0,0,.4);";

    actions.append(completion, button);
    readingContainer.appendChild(actions);

    let completed = false;
    let active = false;

    function expectedCount() {
        return state.currentCards.length + (state.significator ? 1 : 0);
    }

    function interpretationCount() {
        return readingLog.querySelectorAll(".reading-interpretation").length;
    }

    function updateCompletion() {
        if (!active || completed || !expectedCount()) return;
        if (interpretationCount() < expectedCount()) return;
        completed = true;
        actions.classList.remove("hidden");
        actions.style.display = "flex";
        completion.textContent = "Reading complete — all cards have been revealed. You can now download it as a PDF.";
        button.focus({ preventScroll: true });
    }

    function resetCompletion() {
        active = false;
        completed = false;
        actions.classList.add("hidden");
        actions.style.display = "none";
    }

    function positionFor(entry) {
        if (entry.position === "Significator") return { label: "Significator", description: "The card representing the person, matter, or central energy at the heart of the reading." };
        const spread = SPREADS[state.currentSpreadName];
        return spread ? spread.positions.find(position => position.label === entry.position) : null;
    }

    function interpretationFor(entry) {
        if (entry.position === "Significator") return `${capitalize(cardTheme(entry.card, entry.orientation))}. As the Significator, this card represents the person, matter, or central energy at the heart of the reading.`;
        const position = positionFor(entry);
        return position ? getInterpretation(state.currentSpreadId, position.id, entry.card, entry.orientation) : "";
    }

    function buildReport() {
        const report = document.createElement("section");
        report.id = "pdf-reading-report";
        report.innerHTML = `<div class="pdf-report-header"><div class="pdf-report-kicker">TAROT</div><h1>${escapeHtml(state.currentSpreadName || "Tarot Reading")}</h1><div class="pdf-report-date">${escapeHtml(new Date().toLocaleString())}</div></div><div class="pdf-report-cards"></div>`;
        const cards = report.querySelector(".pdf-report-cards");
        state.readingLog.forEach(entry => {
            const position = positionFor(entry);
            const interpretation = interpretationFor(entry);
            const item = document.createElement("article");
            item.className = "pdf-report-card";
            item.innerHTML = `<div class="pdf-card-image-wrap"><img class="pdf-card-image${entry.orientation === "Reversed" ? " pdf-card-reversed" : ""}" src="${escapeHtml(cardImagePath(entry.card))}" alt="${escapeHtml(entry.card)}"></div><div class="pdf-card-copy"><div class="pdf-card-position">${escapeHtml(position?.label || entry.position)}</div><h2>${escapeHtml(entry.card)}</h2><div class="pdf-card-orientation">${escapeHtml(entry.orientation)}</div>${position?.description ? `<p class="pdf-position-description">${escapeHtml(position.description)}</p>` : ""}${interpretation ? `<p>${escapeHtml(interpretation)}</p>` : ""}</div>`;
            cards.appendChild(item);
        });
        document.body.appendChild(report);
        return report;
    }

    function cleanup() {
        document.getElementById("pdf-reading-report")?.remove();
        document.getElementById("pdf-print-style")?.remove();
    }

    async function downloadPdf() {
        if (!completed) return;
        button.disabled = true;
        const report = buildReport();
        const style = document.createElement("style");
        style.id = "pdf-print-style";
        style.textContent = `@media print { @page { size: Letter; margin:.55in; } body > *:not(#pdf-reading-report) { display:none !important; } #pdf-reading-report { display:block !important;color:#222;background:#fff;font-family:Georgia,"Times New Roman",serif; } .pdf-report-header{text-align:center;border-bottom:2px solid #a98749;padding-bottom:18px;margin-bottom:22px}.pdf-report-kicker{letter-spacing:5px;font-size:12px;color:#8a6a32}.pdf-report-header h1{margin:6px 0;font-size:28px}.pdf-report-date{font-size:11px;color:#666}.pdf-report-card{display:flex;gap:22px;align-items:flex-start;padding:18px 0;border-bottom:1px solid #d5d0c6;break-inside:avoid;page-break-inside:avoid}.pdf-card-image-wrap{width:150px;flex:0 0 150px}.pdf-card-image{display:block;width:150px;height:255px;object-fit:contain}.pdf-card-reversed{transform:rotate(180deg)}.pdf-card-copy{flex:1}.pdf-card-position{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a6a32}.pdf-card-copy h2{margin:5px 0 3px;font-size:21px}.pdf-card-orientation{font-size:11px;font-weight:bold;margin-bottom:10px}.pdf-card-copy p{font-size:11px;line-height:1.5;margin:7px 0}.pdf-position-description{color:#555} }`;
        document.head.appendChild(style);
        const images = [...report.querySelectorAll("img")];
        await Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener("load", resolve, { once:true }); image.addEventListener("error", resolve, { once:true }); })));
        window.print();
        window.setTimeout(() => { cleanup(); button.disabled = false; }, 2000);
    }

    currentCard.addEventListener("click", event => {
        if (completed) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        if (!active) {
            active = true;
            completed = false;
            actions.classList.add("hidden");
            actions.style.display = "none";
        }
        window.setTimeout(updateCompletion, 100);
    }, true);

    button.addEventListener("click", downloadPdf);

    const observer = new MutationObserver(() => {
        if (active && !completed) updateCompletion();
        const menu = document.getElementById("menu-screen");
        if (menu && !menu.classList.contains("hidden")) resetCompletion();
    });
    observer.observe(readingInfo, { childList:true, subtree:true, characterData:true });
    observer.observe(readingLog, { childList:true, subtree:true, characterData:true });
})();
