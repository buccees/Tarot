"use strict";

const SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
const RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const MAJOR_ARCANA = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant",
    "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice",
    "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon",
    "The Sun", "Judgement", "The World"
];
const TAROT_CARDS = [];
for (const suit of SUITS) for (const rank of RANKS) TAROT_CARDS.push(`${rank} of ${suit}`);
TAROT_CARDS.push(...MAJOR_ARCANA);

const SPREADS = {
    "Single Card": { id: "single-card", positions: [
        { id: "focus", label: "Focus", description: "The central message, influence, or energy surrounding your question right now." }
    ] },
    "Three-Card": { id: "three-card", positions: [
        { id: "past", label: "Past", description: "What has shaped the situation and what influence from the past still matters." },
        { id: "present", label: "Present", description: "The situation as it stands now and the forces currently at work." },
        { id: "future", label: "Future", description: "The direction the situation is moving toward if its present course continues." }
    ] },
    "Five-Card — Situation & Advice": { id: "five-situation", positions: [
        { id: "situation", label: "Situation", description: "The central circumstances surrounding the question." },
        { id: "challenge", label: "Challenge", description: "The principal difficulty, resistance, or opposing influence to be understood." },
        { id: "root", label: "Underlying Cause", description: "The foundation or deeper cause beneath the present circumstances." },
        { id: "guidance", label: "Guidance", description: "The attitude, action, or understanding that may help you navigate the situation." },
        { id: "outcome", label: "Likely Direction", description: "Where the situation is tending when the forces shown by the spread are followed." }
    ] },
    "Five-Card — Five-Card Cross": { id: "five-cross", positions: [
        { id: "present", label: "Present", description: "The central situation and its dominant energy." },
        { id: "past", label: "Past Influence", description: "A past influence that continues to affect the present matter." },
        { id: "future", label: "Future Influence", description: "An influence that is beginning to emerge or shape what comes next." },
        { id: "foundation", label: "Foundation", description: "The underlying basis, root, or condition upon which the situation rests." },
        { id: "potential", label: "Potential", description: "The possibility or direction that can emerge from the forces currently at work." }
    ] },
    "Five-Card — Expanded Past–Present–Future": { id: "five-expanded", positions: [
        { id: "past", label: "Past", description: "The history or earlier influence that helped create the present situation." },
        { id: "present", label: "Present", description: "The condition of the matter and its strongest current influence." },
        { id: "future", label: "Future", description: "The direction or development that is beginning to emerge." },
        { id: "advice", label: "Advice", description: "The perspective or action that may best serve you as the situation develops." },
        { id: "outcome", label: "Outcome", description: "The likely culmination of the forces represented in the reading." }
    ] },
    "Five-Card — Relationship Cross": { id: "five-relationship", positions: [
        { id: "you", label: "You", description: "Your position, feelings, attitude, or role within the relationship." },
        { id: "other", label: "Other Person", description: "The other person's position, influence, or apparent role in the relationship." },
        { id: "foundation", label: "Relationship Foundation", description: "The underlying bond, history, or force that connects the two of you." },
        { id: "present", label: "Present State", description: "The relationship as it exists now and the energy currently passing between you." },
        { id: "outcome", label: "Likely Outcome", description: "The direction the relationship is tending toward under its present conditions." }
    ] },
    "Five-Card — Decision / Crossroads": { id: "five-decision", positions: [
        { id: "current", label: "Current Position", description: "Where you stand now and the circumstances surrounding the choice." },
        { id: "path-a", label: "Path A", description: "The character, influence, and likely direction of choosing the first path." },
        { id: "path-b", label: "Path B", description: "The character, influence, and likely direction of choosing the second path." },
        { id: "hidden", label: "Hidden Influence", description: "A factor beneath the surface that may affect the decision or its consequences." },
        { id: "guidance", label: "Guidance", description: "The wisdom or perspective that can help you approach the choice." }
    ] },
    "Five-Card — Timeline": { id: "five-timeline", positions: [
        { id: "recent", label: "Recent Past", description: "The most recent influence or event contributing to the present situation." },
        { id: "present", label: "Present", description: "The current condition and dominant energy of the matter." },
        { id: "near", label: "Near Future", description: "What is likely to emerge or become active next." },
        { id: "developing", label: "Developing Future", description: "The longer development that may follow as the situation unfolds." },
        { id: "outcome", label: "Outcome", description: "The likely culmination or destination of the developing situation." }
    ] },
    "Celtic Cross": { id: "celtic", significator: true, positions: [
        { id: "covers", label: "What Covers", description: "The matter itself: the present atmosphere and circumstances surrounding the question." },
        { id: "crosses", label: "What Crosses", description: "The opposing, challenging, or assisting force crossing the central matter." },
        { id: "crowns", label: "What Crowns", description: "What is above the matter: the conscious influence, ideal, or higher possibility associated with it." },
        { id: "beneath", label: "What Is Beneath", description: "The foundation of the matter: its underlying basis, root, or deeper cause." },
        { id: "behind", label: "What Is Behind", description: "An influence that has just passed or is passing away from the situation." },
        { id: "before", label: "What Is Before", description: "An influence coming into action in the near future." },
        { id: "self", label: "Himself / Herself", description: "The querent's position, attitude, or role in relation to the matter." },
        { id: "environment", label: "The House / Environment", description: "The surrounding circumstances, other people, and outside influences affecting the matter." },
        { id: "hopes", label: "Hopes or Fears", description: "The hopes, fears, expectations, or anxieties the querent brings to the situation." },
        { id: "outcome", label: "What Will Come", description: "The culmination or likely result of the influences represented throughout the Cross." }
    ] }
};

const state = {
    currentCards: [], currentOrientations: [], currentSpreadName: "", currentSpreadId: "", currentPositions: [],
    cardIndex: 0, currentRevealed: false, readingLog: [], significator: null, significatorOrientation: null, significatorRevealed: false
};

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
function cardImagePath(cardName) { return `${CARD_ROOT}${cardName.replaceAll(" ", "_")}.png`; }
function sampleCards(cards, count) {
    const pool = [...cards], selected = [];
    while (selected.length < count) { const index = Math.floor(Math.random() * pool.length); selected.push(pool[index]); pool.splice(index, 1); }
    return selected;
}
function randomOrientation() { return Math.random() < 0.5 ? "Upright" : "Reversed"; }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function capitalize(value) { return value ? value.charAt(0).toUpperCase() + value.slice(1) : value; }
function currentPosition() { return state.currentPositions[state.cardIndex] || null; }
function positionHeader(position, prefix = "") {
    if (!position) return;
    readingInfo.innerHTML = `<div class="reading-position-context"><div class="reading-spread-name">${escapeHtml(prefix || state.currentSpreadName)}</div><h2>${escapeHtml(position.label)}</h2><p>${escapeHtml(position.description)}</p></div>`;
}
function showFiveCardOptions() { spreadMenu.classList.add("hidden"); fiveCardOptions.classList.remove("hidden"); }
function hideFiveCardOptions() { fiveCardOptions.classList.add("hidden"); spreadMenu.classList.remove("hidden"); }
function resetState() {
    state.currentCards = []; state.currentOrientations = []; state.currentSpreadName = ""; state.currentSpreadId = ""; state.currentPositions = [];
    state.cardIndex = 0; state.currentRevealed = false; state.readingLog = []; state.significator = null; state.significatorOrientation = null; state.significatorRevealed = false;
}
function showMenu() {
    menuScreen.classList.remove("hidden"); readingScreen.classList.add("hidden"); hideFiveCardOptions(); resetState();
    cardImage.src = CARD_BACK; cardImage.alt = "Tarot card back"; currentCard.classList.remove("reversed"); cardInterpretation.classList.add("hidden"); readingInfo.innerHTML = ""; refreshReadingLog();
}
function startReading(spreadName) {
    const spread = SPREADS[spreadName]; if (!spread) return;
    resetState(); state.currentSpreadName = spreadName; state.currentSpreadId = spread.id; state.currentPositions = spread.positions;
    if (spread.significator) {
        const selected = sampleCards(TAROT_CARDS, spread.positions.length + 1);
        state.significator = selected[0]; state.significatorOrientation = randomOrientation(); state.currentCards = selected.slice(1);
    } else state.currentCards = sampleCards(TAROT_CARDS, spread.positions.length);
    state.currentOrientations = state.currentCards.map(() => randomOrientation());
    menuScreen.classList.add("hidden"); readingScreen.classList.remove("hidden");
    if (spread.significator) showSignificatorBack(); else showCard();
}
function showSignificatorBack() {
    state.currentRevealed = false;
    readingInfo.innerHTML = `<div class="reading-position-context"><div class="reading-spread-name">Celtic Cross</div><h2>Significator</h2><p>The card representing the person, matter, or central energy at the heart of the reading. It is drawn separately from the ten positions of the Cross.</p></div>`;
    cardImage.src = CARD_BACK; cardImage.alt = "Significator card back"; currentCard.classList.remove("reversed"); instruction.textContent = "Tap the card to reveal the Significator"; cardInterpretation.classList.add("hidden"); refreshReadingLog();
}
function revealSignificator() {
    state.significatorRevealed = true; state.currentRevealed = true;
    cardImage.src = cardImagePath(state.significator); cardImage.alt = `${state.significator} (${state.significatorOrientation})`; currentCard.classList.toggle("reversed", state.significatorOrientation === "Reversed");
    instruction.textContent = `${state.significator}\n(${state.significatorOrientation})\n\nTap to begin the ten-card Cross`;
    interpretationTitle.textContent = `Significator — ${state.significator} (${state.significatorOrientation})`;
    const displayedInterpretation = `${capitalize(cardTheme(state.significator, state.significatorOrientation))}. As the Significator, this card represents the person, matter, or central energy at the heart of the reading.`;
    interpretationText.textContent = displayedInterpretation;
    cardInterpretation.classList.remove("hidden");
    state.readingLog = [{ position: "Significator", card: state.significator, orientation: state.significatorOrientation, interpretation: displayedInterpretation }];
    refreshReadingLog();
}
function showCard() {
    const position = currentPosition(); if (!position) return;
    state.currentRevealed = false; positionHeader(position);
    cardImage.src = CARD_BACK; cardImage.alt = "Tarot card back"; currentCard.classList.remove("reversed"); instruction.textContent = "Tap the card to reveal"; cardInterpretation.classList.add("hidden"); refreshReadingLog();
}
function revealCard() {
    if (state.currentSpreadId === "celtic" && !state.significatorRevealed) { revealSignificator(); return; }
    if (state.currentSpreadId === "celtic" && state.significatorRevealed && state.readingLog.length === 1 && state.cardIndex === 0 && state.currentRevealed) { showCard(); return; }
    if (state.currentRevealed) { nextCardOrMenu(); return; }
    const cardName = state.currentCards[state.cardIndex], orientation = state.currentOrientations[state.cardIndex], position = currentPosition();
    cardImage.src = cardImagePath(cardName); cardImage.alt = `${cardName} (${orientation})`; currentCard.classList.toggle("reversed", orientation === "Reversed"); state.currentRevealed = true;
    const isLast = state.cardIndex + 1 >= state.currentCards.length;
    instruction.textContent = `${cardName}\n(${orientation})\n\n${isLast ? "Tap to return to menu" : "Tap for next card"}`;
    const interpretation = getInterpretation(state.currentSpreadId, position.id, cardName, orientation);
    const displayedInterpretation = interpretation || "This position does not yet have a contextual interpretation.";
    interpretationTitle.textContent = `${position.label} — ${cardName} (${orientation})`;
    interpretationText.textContent = displayedInterpretation;
    cardInterpretation.classList.remove("hidden");
    state.readingLog.push({ position: position.label, card: cardName, orientation, interpretation: displayedInterpretation });
    refreshReadingLog();
}
function nextCardOrMenu() { state.cardIndex += 1; if (state.cardIndex >= state.currentCards.length) { showMenu(); return; } showCard(); }
function refreshReadingLog() {
    if (!state.readingLog.length) { readingLog.innerHTML = ""; return; }
    readingLog.innerHTML = state.readingLog.map(entry => `<div class="reading-entry"><span class="reading-position">${escapeHtml(entry.position)}:</span> ${escapeHtml(entry.card)} (${escapeHtml(entry.orientation)})</div>`).join("");
}

document.querySelectorAll(".spread-card").forEach(button => { if (button.id !== "five-card-button") button.addEventListener("click", () => startReading(button.dataset.spread)); });
fiveCardButton.addEventListener("click", showFiveCardOptions);
fiveCardBack.addEventListener("click", hideFiveCardOptions);
document.querySelectorAll(".spread-option").forEach(button => button.addEventListener("click", () => startReading(button.dataset.spread)));
currentCard.addEventListener("click", revealCard);
showMenu();
