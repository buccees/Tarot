"use strict";

const diceHistory = document.getElementById("dice-history");
const diceButtons = document.querySelectorAll(".die-button");
const MAX_DICE_HISTORY = 12;

function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

function formatDieResult(sides, value) {
    if (sides === 2) return value === 1 ? "Heads" : "Tails";
    return String(value);
}

function addDiceResult(sides, value) {
    const entry = document.createElement("div");
    const name = document.createElement("span");
    const result = document.createElement("span");
    entry.className = "dice-result";
    name.className = "dice-result-name";
    result.className = "dice-result-value";
    name.textContent = `d${sides}`;
    result.textContent = formatDieResult(sides, value);
    entry.append(name, result);
    diceHistory.prepend(entry);
    while (diceHistory.children.length > MAX_DICE_HISTORY) diceHistory.lastElementChild.remove();
}

diceButtons.forEach(button => {
    button.addEventListener("click", () => {
        const sides = Number(button.dataset.sides);
        if (!Number.isInteger(sides) || sides < 2) return;
        const value = rollDie(sides);
        addDiceResult(sides, value);
        button.classList.remove("dice-rolled");
        void button.offsetWidth;
        button.classList.add("dice-rolled");
    });
});
