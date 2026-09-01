/*
 * Tarot interpretation system
 *
 * Source foundation:
 * - Arthur Edward Waite, The Pictorial Key to the Tarot (1911),
 *   especially Part III, Sections 3-7.
 * - The five-card layouts are presented as established spread variants;
 *   there is no single universally canonical five-card layout.
 *
 * The application uses Waite-derived card themes and spread-position
 * functions, then rewrites them in concise modern language for the
 * particular question the position asks.
 */

const MAJOR_MEANINGS = {
    "The Fool": ["new beginning, freedom, leap of faith", "recklessness, hesitation, refusing to begin"],
    "The Magician": ["initiative, skill, will, making an idea real", "manipulation, scattered will, unused ability"],
    "The High Priestess": ["intuition, hidden knowledge, inner knowing", "secrecy, confusion, ignoring intuition"],
    "The Empress": ["creation, abundance, nurture, growth", "stagnation, overdependence, blocked creativity"],
    "The Emperor": ["structure, authority, order, stability", "rigidity, control, domination"],
    "The Hierophant": ["tradition, teaching, established wisdom, guidance", "rebellion, unconventional path, rigid belief"],
    "The Lovers": ["union, values, choice, meaningful relationship", "disharmony, divided values, difficult choice"],
    "The Chariot": ["determination, direction, disciplined movement", "loss of control, conflicting drives, stalled progress"],
    "Strength": ["courage, patience, compassion, inner mastery", "self-doubt, force without balance, insecurity"],
    "The Hermit": ["solitude, reflection, searching for wisdom", "isolation, withdrawal, avoiding inner work"],
    "Wheel of Fortune": ["change, cycles, turning point, movement of circumstances", "resistance to change, unstable cycle, missed timing"],
    "Justice": ["truth, fairness, accountability, consequences", "imbalance, denial, unfairness, avoiding responsibility"],
    "The Hanged Man": ["pause, surrender, new perspective, letting go", "stagnation, resistance, needless delay"],
    "Death": ["ending, transformation, release, transition", "clinging to what is over, resistance to transformation"],
    "Temperance": ["balance, moderation, healing, integration", "excess, impatience, imbalance, poor combination"],
    "The Devil": ["attachment, desire, material pull, confronting bondage", "release, breaking a pattern, or denial of an attachment"],
    "The Tower": ["upheaval, revelation, collapse of an unstable structure", "resistance to change, delayed disruption, fear of truth"],
    "The Star": ["hope, renewal, faith, healing, inspiration", "discouragement, depleted hope, difficulty trusting"],
    "The Moon": ["uncertainty, dreams, intuition, hidden fears", "confusion clearing, fear exposed, distorted perception"],
    "The Sun": ["clarity, vitality, joy, success, illumination", "temporary clouding, delayed joy, overconfidence"],
    "Judgement": ["awakening, reckoning, renewal, answering a call", "self-judgement, avoidance, difficulty moving forward"],
    "The World": ["completion, integration, achievement, wholeness", "unfinished cycle, incomplete closure, delayed completion"]
};

const SUIT_MEANINGS = {
    Wands: ["drive, initiative, ambition and creative fire", "motivation, enterprise and the force to act"],
    Cups: ["emotion, relationships, intuition and the inner life", "feelings, connection, receptivity and emotional meaning"],
    Swords: ["thought, truth, conflict, decisions and communication", "clarity, tension, analysis and the consequences of choices"],
    Pentacles: ["work, resources, health, security and the material world", "practical effort, stability, value and tangible results"]
};

const RANK_MEANINGS = {
    Ace: ["a beginning or pure potential", "a blocked beginning or unrealized potential"],
    Two: ["balance, pairing, choice or a developing tension", "indecision, imbalance or a partnership under strain"],
    Three: ["growth, expression, collaboration or an early result", "delay, misalignment or growth that needs correction"],
    Four: ["stability, consolidation, pause or established form", "stagnation, possessiveness or stability becoming restrictive"],
    Five: ["change through tension, challenge, loss or competition", "conflict that can be learned from, or resistance to necessary change"],
    Six: ["movement, support, recovery, exchange or harmony", "difficulty receiving, imbalance in exchange or delayed progress"],
    Seven: ["testing, evaluation, strategy or standing by one's position", "doubt, poor strategy, withdrawal or difficulty sustaining a position"],
    Eight: ["movement, skill, work, speed or focused development", "restriction, scattered effort or movement without direction"],
    Nine: ["maturity, resilience, culmination or a personal result", "strain, guardedness, overextension or a result not yet secure"],
    Ten: ["completion, culmination, full consequence or lasting structure", "burden, excess, ending under pressure or a cycle that needs release"],
    Page: ["a message, student, beginning, curiosity or emerging person", "immaturity, mixed signals, blocked learning or delayed news"],
    Knight: ["movement, pursuit, action and a strong expression of the suit", "haste, inconsistency, impulsiveness or misdirected action"],
    Queen: ["mature inward mastery and embodiment of the suit", "blocked maturity, overidentification or an imbalance in the suit"],
    King: ["mature outward mastery, leadership and command of the suit", "misuse of authority, excess or leadership without balance"]
};

function cardTheme(card, orientation) {
    if (MAJOR_MEANINGS[card]) {
        return MAJOR_MEANINGS[card][orientation === "Reversed" ? 1 : 0];
    }

    const match = card.match(/^(Ace|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Page|Knight|Queen|King) of (Wands|Cups|Swords|Pentacles)$/);
    if (!match) return "an influence that deserves attention in this position";

    const rank = match[1];
    const suit = match[2];
    const index = orientation === "Reversed" ? 1 : 0;
    return `${RANK_MEANINGS[rank][index]} expressed through ${SUIT_MEANINGS[suit][index]}`;
}

const POSITION_PURPOSES = {
    "single-card:focus": "the central answer, theme or influence to contemplate now",
    "three-card:past": "what has shaped the situation and is still coloring the present",
    "three-card:present": "what is active now and deserves the clearest attention",
    "three-card:future": "the direction or influence most likely to develop next",

    "five-situation:situation": "the heart of the matter and the circumstances surrounding the question",
    "five-situation:challenge": "the principal difficulty, tension or opposing force",
    "five-situation:root": "the underlying cause or foundation already established",
    "five-situation:guidance": "the attitude or course of action that best responds to the situation",
    "five-situation:outcome": "the likely direction if the present pattern continues",

    "five-cross:present": "the central state of the matter right now",
    "five-cross:past": "the influence coming from what has already happened",
    "five-cross:future": "the influence beginning to develop ahead",
    "five-cross:foundation": "what supports, underlies or quietly drives the situation",
    "five-cross:potential": "what can emerge from the present pattern if its lesson is understood",

    "five-expanded:past": "the story or influence that brought the matter here",
    "five-expanded:present": "the condition of the matter at this moment",
    "five-expanded:future": "the direction in which events or energies are moving",
    "five-expanded:advice": "the most useful response or lesson to carry forward",
    "five-expanded:outcome": "the likely culmination of the pattern shown by the reading",

    "five-relationship:you": "your position, contribution or perspective within the relationship",
    "five-relationship:other": "the other person's position or perspective as it appears through the relationship",
    "five-relationship:foundation": "the basis, history or underlying bond between you",
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
    "celtic:crosses": "the obstacle, opposing force or influence crossing the matter",
    "celtic:crowns": "the querent's aim or ideal, and the best that can presently be achieved",
    "celtic:beneath": "the foundation or basis already made real in the situation",
    "celtic:behind": "the influence that has just passed or is now passing away",
    "celtic:before": "the influence coming into action in the near future",
    "celtic:self": "the querent's position or attitude toward the circumstances",
    "celtic:environment": "the surrounding people, conditions and tendencies affecting the matter",
    "celtic:hopes": "the hopes or fears invested in the matter",
    "celtic:outcome": "what will come: the culmination produced by the other influences in the spread"
};

function getInterpretation(spread, position, card, orientation) {
    const key = `${spread}:${position}`;
    const purpose = POSITION_PURPOSES[key];
    if (!purpose) return null;

    const theme = cardTheme(card, orientation);
    const direction = orientation === "Reversed"
        ? "Because the card is reversed, the theme may be blocked, internalized, delayed, exaggerated, or expressed through its difficult side."
        : "Upright, the card's central theme is available to operate more directly in the position.";

    return `${capitalize(theme)}. In this position, that points to ${purpose}. ${direction}`;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
