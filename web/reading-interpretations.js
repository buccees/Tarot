"use strict";

/*
 * Complete contextual interpretation layer.
 *
 * Every supported card/position/orientation combination is resolved from
 * the application's 78-card Rider-Waite-Smith vocabulary. The prose below
 * is original application text: it uses traditional card themes and the
 * specific job of the spread position rather than copying modern websites.
 *
 * Research foundation:
 * - A. E. Waite, The Pictorial Key to the Tarot (1911), public domain.
 * - Tarotoo Tarot Card Meanings dataset (2026), MIT License, used as a
 *   modern structured cross-check for upright/reversed vocabulary.
 * - Pro Bono Tarot Guild, RWS Cards in Context, used as a modern reference
 *   for position-specific interpretation.
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
        : "Upright, the card's central energy is available to express itself more directly. The position determines where that energy belongs in the reading."
}

function contextualPositionAdvice(position) {
    if (["challenge", "crosses"].includes(position)) {
        return "Read this card as the part of the situation that requires recognition or conscious response. Its difficult expression can describe the obstacle, while its healthier expression can suggest the quality needed to meet it.";
    }
    if (["guidance", "advice"].includes(position)) {
        return "Read this as a principle to consider rather than a command. Ask what this card's qualities would look like as a deliberate choice, and what happens when those qualities are avoided, exaggerated, or misunderstood.";
    }
    if (["outcome", "potential"].includes(position)) {
        return "Here the card describes a direction produced by the forces already present. It is a likely pattern rather than an unavoidable fate; choices and circumstances can change how that pattern unfolds.";
    }
    if (["you", "self", "other", "environment", "current"].includes(position)) {
        return "Here the card can describe an attitude, role, behavior, or surrounding influence. Consider whether it is showing what someone is doing, experiencing, or being asked to embody.";
    }
    if (["past", "recent", "behind"].includes(position)) {
        return "Because this is a past-facing position, the card describes an influence that has already entered the story and may still be leaving its imprint on the present.";
    }
    if (["future", "near", "before", "developing"].includes(position)) {
        return "Because this is a future-facing position, the card describes an influence that may become more visible as the situation develops; it is a direction of possibility, not a fixed guarantee.";
    }
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

/* Expose the complete resolver used by the reading engine. */
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

/*
 * Presentation layer: keep every completed interpretation below the single
 * horizontal separator, in draw order, without changing the card layout.
 */
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

    currentCard.addEventListener("click", captureVisibleInterpretation, true);
    currentCard.addEventListener("click", () => {
        window.setTimeout(() => {
            captureVisibleInterpretation();
            render();
            resetIfBackAtMenu();
        }, 0);
    });
})();
