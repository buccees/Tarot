"use strict";

/*
 * Custom Art Tarot
 *
 * Browser implementation of the existing Kivy Tarot application.
 */


/* =========================
   TAROT DECK
   ========================= */

const SUITS = [
    "Wands",
    "Cups",
    "Swords",
    "Pentacles"
];

const RANKS = [
    "Ace",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Page",
    "Knight",
    "Queen",
    "King"
];

const MAJOR_ARCANA = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
    "Wheel of Fortune",
    "Justice",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World"
];

const TAROT_CARDS = [];

for (const suit of SUITS) {
    for (const rank of RANKS) {
        TAROT_CARDS.push(`${rank} of ${suit}`);
    }
}

TAROT_CARDS.push(...MAJOR_ARCANA);


/* =========================
   SPREAD POSITIONS
   ========================= */

const SPREAD_POSITIONS = {
    "Single Card": [
        "Focus"
    ],

    "Three-Card": [
        "Past",
        "Present",
        "Future"
    ],

    "Five-Card": [
        "Situation",
        "Challenge",
        "Advice",
        "Underlying Cause",
        "Likely Outcome"
    ],

    "Celtic Cross": [
        "Present",
        "Challenge",
        "Foundation",
        "Recent Past",
        "Possible Outcome",
        "Near Future",
        "Your Approach",
        "External Influences",
        "Hopes & Fears",
        "Final Outcome"
    ]
};


/* =========================
   APPLICATION STATE
   ========================= */

const state = {
    currentCards: [],
    currentOrientations: [],
    currentSpreadName: "",
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

const currentCard = document.getElementById("current-card");
const cardImage = document.getElementById("card-image");

const readingInfo = document.getElementById("reading-info");
const instruction = document.getElementById("instruction");
const readingLog = document.getElementById("reading-log");

const CARD_BACK =
    "../images/rider-waite-tarot/CardBacks.jpg";


/* =========================
   HELPERS
   ========================= */

function cardImagePath(cardName) {
    const filename =
        cardName.replaceAll(" ", "_") + ".png";

    return `../images/rider-waite-tarot/${filename}`;
}


function randomInt(max) {
    return Math.floor(Math.random() * max);
}


/*
 * Equivalent in purpose to Python's random.sample().
 *
 * Cards are selected without replacement.
 */
function sampleCards(cards, count) {
    const pool = [...cards];
    const selected = [];

    while (selected.length < count) {
        const index = randomInt(pool.length);

        selected.push(pool[index]);
        pool.splice(index, 1);
    }

    return selected;
}


function randomOrientation() {
    return Math.random() < 0.5
        ? "Upright"
        : "Reversed";
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
   MENU
   ========================= */

function showMenu() {
    menuScreen.classList.remove("hidden");
    readingScreen.classList.add("hidden");

    state.currentCards = [];
    state.currentOrientations = [];
    state.currentSpreadName = "";
    state.currentPositions = [];
    state.cardIndex = 0;
    state.currentRevealed = false;
    state.readingLog = [];
}


/* =========================
   START READING
   ========================= */

function startReading(numCards, spreadName) {
    state.currentCards =
        sampleCards(TAROT_CARDS, numCards);

    state.currentOrientations =
        Array.from(
            { length: numCards },
            () => randomOrientation()
        );

    state.currentSpreadName = spreadName;

    state.currentPositions =
        SPREAD_POSITIONS[spreadName] ||
        Array.from(
            { length: numCards },
            (_, index) => `Card ${index + 1}`
        );

    state.cardIndex = 0;
    state.currentRevealed = false;
    state.readingLog = [];

    menuScreen.classList.add("hidden");
    readingScreen.classList.remove("hidden");

    showCard();
}


/* =========================
   SHOW CURRENT CARD
   ========================= */

function showCard() {
    const cardName =
        state.currentCards[state.cardIndex];

    const orientation =
        state.currentOrientations[state.cardIndex];

    const positionName =
        state.currentPositions[state.cardIndex];

    state.currentRevealed = false;

    readingInfo.textContent =
        `${state.currentSpreadName} • ` +
        `${positionName} • ` +
        `Card ${state.cardIndex + 1} of ` +
        `${state.currentCards.length}`;

    cardImage.src = CARD_BACK;
    cardImage.alt = "Tarot card back";

    currentCard.classList.remove("reversed");

    instruction.textContent =
        "Tap the card to reveal";

    refreshReadingLog();
}


/* =========================
   REVEAL
   ========================= */

function revealCard() {
    /*
     * Match the Kivy behavior:
     *
     * First tap:
     *   reveal card
     *
     * Second tap:
     *   advance to next card
     *   or return to menu
     */
    if (state.currentRevealed) {
        nextCardOrMenu();
        return;
    }

    const cardName =
        state.currentCards[state.cardIndex];

    const orientation =
        state.currentOrientations[state.cardIndex];

    const positionName =
        state.currentPositions[state.cardIndex];

    cardImage.src = cardImagePath(cardName);

    cardImage.alt =
        `${cardName} (${orientation})`;

    if (orientation === "Reversed") {
        currentCard.classList.add("reversed");
    } else {
        currentCard.classList.remove("reversed");
    }

    state.currentRevealed = true;

    const isLastCard =
        state.cardIndex + 1 >= state.currentCards.length;

    const nextText = isLastCard
        ? "Tap to return to menu"
        : "Tap for next card";

    instruction.textContent =
        `${cardName}\n` +
        `(${orientation})\n\n` +
        nextText;

    state.readingLog.push({
        position: positionName,
        card: cardName,
        orientation: orientation
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
   READING LOG
   ========================= */

function refreshReadingLog() {
    if (state.readingLog.length === 0) {
        readingLog.innerHTML =
            "<em>Revealed cards will appear here</em>";
        return;
    }

    readingLog.innerHTML =
        state.readingLog
            .map(entry => {
                return `
                    <div class="reading-entry">
                        <span class="reading-position">
                            ${escapeHtml(entry.position)}:
                        </span>
                        ${escapeHtml(entry.card)}
                        (${escapeHtml(entry.orientation)})
                    </div>
                `;
            })
            .join("");
}


/* =========================
   EVENTS
   ========================= */

document
    .querySelectorAll(".spread-card")
    .forEach(button => {

        button.addEventListener("click", () => {
            const spreadName =
                button.dataset.spread;

            const count =
                Number(button.dataset.count);

            startReading(count, spreadName);
        });
    });


currentCard.addEventListener(
    "click",
    revealCard
);


/* =========================
   INITIALIZE
   ========================= */

showMenu();
