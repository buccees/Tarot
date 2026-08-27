/*
 * Tarot Interpretation Database
 *
 * RESERVED CAPACITY:
 *
 * 78 cards
 * x 19 spread positions
 * x 2 orientations
 * = 2,964 possible interpretations
 *
 * The entries below are intentionally empty.
 * Add the actual customer-facing text later.
 */

const interpretations = {
    "single-card": {
        "answer": {}
    },

    "three-card": {
        "past": {},
        "present": {},
        "future": {}
    },

    "five-card": {
        "situation": {},
        "challenge": {},
        "past-influence": {},
        "guidance": {},
        "outcome": {}
    },

    "celtic-cross": {
        "present": {},
        "challenge": {},
        "foundation": {},
        "past": {},
        "possible-future": {},
        "near-future": {},
        "self": {},
        "environment": {},
        "hopes-and-fears": {},
        "outcome": {}
    }
};


/*
 * Get an interpretation.
 *
 * Returns null when that particular interpretation
 * has not been written yet.
 *
 * Example:
 *
 * getInterpretation(
 *     "celtic-cross",
 *     "challenge",
 *     "The Fool",
 *     "reversed"
 * );
 */

function getInterpretation(spread, position, card, orientation) {
    const spreadData = interpretations[spread];

    if (!spreadData) {
        return null;
    }

    const positionData = spreadData[position];

    if (!positionData) {
        return null;
    }

    const cardData = positionData[card];

    if (!cardData) {
        return null;
    }

    return cardData[orientation] || null;
}
