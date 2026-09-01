"use strict";

/* =========================
   DECK
   ========================= */

const SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
const RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const MAJOR_ARCANA = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant",
    "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice",
    "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon",
    "The Sun", "Judgement", "The World"
];

const TAROT_CARDS = [];
for (const suit of SUITS) {
    for (const rank of RANKS) TAROT_CARDS.push(`${rank} of ${suit}`);
}
TAROT_CARDS.push(...MAJOR_ARCANA);

/* =========================
   TRADITIONAL / ESTABLISHED SPREADS
   ========================= */

const SPREADS = {
    "Single Card": {
        id: "single-card",
        positions: [{ id: "focus", label: "Focus" }]
    },

    "Three-Card": {
        id: "three-card",
        positions: [
            { id: "past", label: "Past" },
            { id: "present", label: "Present" },
            { id: "future", label: "Future" }
        ]
    },

    "Five-Card — Situation & Advice": {
        id: "five-situation",
        positions: [
            { id: "situation", label: "Situation" },
            { id: "challenge", label: "Challenge" },
            { id: "root", label: "Underlying Cause" },
            { id: "guidance", label: "Guidance" },
            { id: "outcome", label: "Likely Direction" }
        ]
    },

    "Five-Card — Five-Card Cross": {
        id: "five-cross",
        positions: [
            { id: "present", label: "Present" },
            { id: "past", label: "Past Influence" },
            { id: "future", label: "Future Influence" },
            { id: "foundation", label: "Foundation" },
            { id: "potential", label: "Potential" }
        ]
    },

    "Five-Card — Expanded Past–Present–Future": {
        id: "five-expanded",
        positions: [
            { id: "past", label: "Past" },
            { id: "present", label: "Present" },
            { id: "future", label: "Future" },
            { id: "advice", label: "Advice" },
            { id: "outcome", label: "Outcome" }
        ]
    },

    "Five-Card — Relationship Cross": {
        id: "five-relationship",
        positions: [
            { id: "you", label: "You" },
            { id: "other", label: "Other Person" },
            { id: "foundation", label: "Relationship Foundation" },
            { id: "present", label: "Present State" },
            { id: "outcome", label: "Likely Outcome" }
        ]
    },

    "Five-Card — Decision / Crossroads": {
        id: "five-decision",
        positions: [
            { id: "current", label: "Current Position" },
            { id: "path-a", label: "Path A" },
            { id: "path-b", label: "Path B" },
            { id: "hidden", label: "Hidden Influence" },
            { id: "guidance", label: "Guidance" }
        ]
    },

    "Five-Card — Timeline": {
        id: "five-timeline",
        positions: [
            { id: "recent", label: "Recent Past" },
            { id: "present", label: "Present" },
            { id: "near", label: "Near Future" },
            { id: "developing", label: "Developing Future" },
            { id: "outcome", label: "Outcome" }
        ]
    },

    /*
     * Waite's Celtic Cross uses a separately selected Significator.
     * The Significator is not one of the ten numbered cards in the Cross.
     */
    "Celtic Cross": {
        id: "celtic",
        significator: true,
        positions: [
            { id: "covers", label: "What Covers" },
            { id: "crosses", label: "What Crosses" },
            { id: "crowns", label: "What Crowns" },
            { id: "beneath", label: "What Is Beneath" },
            { id: "behind", label: "What Is Behind" },
            { id: "before", label: "What Is Before" },
            { id: "self", label: "Himself / Herself" },
            { id: "environment", label: "The House / Environment" },
            { id: "hopes", label: "Hopes or Fears" },
            { id: "outcome", label: "What Will Come" }
        ]
    }
};

/* =========================
   STATE
   ========================= */

const state = {
    currentCards: [],
    currentOrientations: [],
    significator: null,
    significatorOrientation: null,
    currentSpreadName: "",
    currentSpreadId: "",
    currentPositions: [],
    cardIndex: 0,
    currentRevealed: false,
    readingLog: []
};

/* =========================
   DOM
   ========================= */

const menuScreen = document.getElementById("menu-screen");
const readingScreen = document.getElementById("reading-screen");
const spreadMenu = document.getElementById("spread-menu");
const fiveCardOptions = document.getElementById("five-card-options");
const fiveCardButton = document.getElementById("five-card-button");
const fiveCardBack = document.getElementById("five-card-back");
const currentCard = document.getElementById("current-card");
const cardImage = document.getElementById("card-image");
const readingInfo = document.getElementById("reading-info");
const instruction = document.getElementById("instruction");
const readingLog = document.getElementById("reading-log");
const cardInterpretation = document.getElementById("card-interpretation");
const interpretationTitle = document.getElementById("interpretation-title");
const interpretationText = document.getElementById("interpretation-text");

const CARD_ROOT = "images/rider-waite-tarot/";
const CARD_BACK = `${CARD_ROOT}CardBacks.jpg`;

function cardImagePath(cardName) {
    return `${CARD_ROOT}${cardName.replaceAll(" ", "_")}.png`;
}

function sampleCards(cards, count) {
    const pool = [...cards];
    const selected = [];
    while (selected.length < count) {
        const index = Math.floor(Math.random() * pool.length);
        selected.push(pool[index]);
        pool.splice(index, 1);
    }
    return selected;
}

function randomOrientation() {
    return Math.random() < 0.5 ? "Upright" : "Reversed";
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================
   MENU / FIVE-CARD CHOOSER
   ========================= */

function showFiveCardOptions() {
    spreadMenu.classList.add("hidden");
    fiveCardOptions.classList.remove("hidden");
}

function hideFiveCardOptions() {
    fiveCardOptions.classList.add("hidden");
    spreadMenu.classList.remove("hidden");
}

function showMenu() {
    menuScreen.classList.remove("hidden");
    readingScreen.classList.add("hidden");
    hideFiveCardOptions();

    state.currentCards = [];
    state.currentOrientations = [];
    state.significator = null;
    state.significatorOrientation = null;
    state.currentSpreadName = "";
    state.currentSpreadId = "";
    state.currentPositions = [];
    state.cardIndex = 0;
    state.currentRevealed = false;
    state.readingLog = [];

    cardImage.src = CARD_BACK;
    cardImage.alt = "Tarot card back";
    currentCard.classList.remove("reversed");
    cardInterpretation.classList.add("hidden");
    refreshReadingLog();
}

/* =========================
   START READING
   ========================= */

function startReading(spreadName) {
    const spread = SPREADS[spreadName];
    if (!spread) return;

    /*
     * For the Celtic Cross, select the Significator separately first.
     * It is removed from the pool before the ten Cross cards are drawn,
     * so the Significator can never duplicate a card in the spread.
     */
    if (spread.significator) {
        const selected = sampleCards(TAROT_CARDS, 11);
        state.significator = selected[0];
        state.significatorOrientation = randomOrientation();
        state.currentCards = selected.slice(1);
    } else {
        state.significator = null;
        state.significatorOrientation = null;
        state.currentCards = sampleCards(TAROT_CARDS, spread.positions.length);
    }

    state.currentOrientations = Array.from(
        { length: spread.positions.length },
        randomOrientation
    );
    state.currentSpreadName = spreadName;
    state.currentSpreadId = spread.id;
    state.currentPositions = spread.positions;
    state.cardIndex = 0;
    state.currentRevealed = false;
    state.readingLog = [];

    menuScreen.classList.add("hidden");
    readingScreen.classList.remove("hidden");

    if (spread.significator) {
        showSignificatorBack();
    } else {
        showCard();
    }
}

/* =========================
   SIGNIFICATOR
   ========================= */

function showSignificatorBack() {
    state.currentRevealed = false;

    readingInfo.textContent = "Celtic Cross • Significator";
    cardImage.src = CARD_BACK;
    cardImage.alt = "Tarot card back";
    currentCard.classList.remove("reversed");
    instruction.textContent = "Tap the card to reveal the Significator";
    cardInterpretation.classList.add("hidden");
    refreshReadingLog();
}

function revealSignificator() {
    cardImage.src = cardImagePath(state.significator);
    cardImage.alt = `${state.significator} (${state.significatorOrientation})`;
    currentCard.classList.toggle(
        "reversed",
        state.significatorOrientation === "Reversed"
    );
    state.currentRevealed = true;

    instruction.textContent =
        `${state.significator}\n` +
        `(${state.significatorOrientation})\n\n` +
        "Tap to begin the ten-card Cross";

    interpretationTitle.textContent =
        `Significator — ${state.significator} (${state.significatorOrientation})`;
    interpretationText.textContent =
        "The Significator represents the person, situation, or central matter for which the Celtic Cross is being read. It is selected separately and is not counted among the ten cards of the Cross.";
    cardInterpretation.classList.remove("hidden");

    state.readingLog.push({
        position: "Significator",
        card: state.significator,
        orientation: state.significatorOrientation
    });
    refreshReadingLog();
}

/* =========================
   SHOW CARD BACK
   ========================= */

function showCard() {
    const position = state.currentPositions[state.cardIndex];
    state.currentRevealed = false;

    readingInfo.textContent = `${state.currentSpreadName} • ${position.label} • Card ${state.cardIndex + 1} of ${state.currentCards.length}`;
    cardImage.src = CARD_BACK;
    cardImage.alt = "Tarot card back";
    currentCard.classList.remove("reversed");
    instruction.textContent = "Tap the card to reveal";
    cardInterpretation.classList.add("hidden");
    refreshReadingLog();
}

/* =========================
   REVEAL
   ========================= */

function revealCard() {
    if (state.currentSpreadId === "celtic" && state.cardIndex === 0 && !state.currentRevealed && state.readingLog.length === 0) {
        revealSignificator();
        return;
    }

    if (state.currentSpreadId === "celtic" && state.currentRevealed && state.readingLog.length === 1) {
        state.currentRevealed = false;
        showCard();
        return;
    }

    if (state.currentRevealed) {
        nextCardOrMenu();
        return;
    }

    const cardName = state.currentCards[state.cardIndex];
    const orientation = state.currentOrientations[state.cardIndex];
    const position = state.currentPositions[state.cardIndex];

    cardImage.src = cardImagePath(cardName);
    cardImage.alt = `${cardName} (${orientation})`;
    currentCard.classList.toggle("reversed", orientation === "Reversed");
    state.currentRevealed = true;

    const isLastCard = state.cardIndex + 1 >= state.currentCards.length;
    instruction.textContent = `${cardName}\n(${orientation})\n\n${isLastCard ? "Tap to return to menu" : "Tap for next card"}`;

    const interpretation = getInterpretation(
        state.currentSpreadId,
        position.id,
        cardName,
        orientation
    );

    interpretationTitle.textContent = `${position.label} — ${cardName} (${orientation})`;
    interpretationText.textContent = interpretation || "This card's contextual interpretation has not been written yet.";
    cardInterpretation.classList.remove("hidden");

    state.readingLog.push({
        position: position.label,
        card: cardName,
        orientation
    });
    refreshReadingLog();
}

/* =========================
   NEXT CARD
   ========================= */

function nextCardOrMenu() {
    state.cardIndex += 1;

    if (state.cardIndex >= state.currentCards.length) {
        showMenu();
        return;
    }

    showCard();
}

/* =========================
   LOG
   ========================= */

function refreshReadingLog() {
    if (state.readingLog.length === 0) {
        readingLog.innerHTML = "<em>Revealed cards will appear here</em>";
        return;
    }

    readingLog.innerHTML = state.readingLog.map(entry => `
        <div class="reading-entry">
            <span class="reading-position">${escapeHtml(entry.position)}:</span>
            ${escapeHtml(entry.card)} (${escapeHtml(entry.orientation)})
        </div>
    `).join("");
}

/* =========================
   EVENTS
   ========================= */

document.querySelectorAll(".spread-card").forEach(button => {
    if (button.id === "five-card-button") return;
    button.addEventListener("click", () => startReading(button.dataset.spread));
});

fiveCardButton.addEventListener("click", showFiveCardOptions);
fiveCardBack.addEventListener("click", hideFiveCardOptions);

document.querySelectorAll(".spread-option").forEach(button => {
    button.addEventListener("click", () => startReading(button.dataset.spread));
});

currentCard.addEventListener("click", revealCard);

showMenu();
