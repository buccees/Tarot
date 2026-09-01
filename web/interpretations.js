/*
 * Tarot interpretation system.
 *
 * The application keeps the reading visual design separate from this data.
 * Interpretations combine card, orientation, spread and position so that a
 * revealed card answers the particular question assigned to its position.
 *
 * Historical foundation: A. E. Waite, The Pictorial Key to the Tarot (1911).
 * Modern cross-checks are documented in docs/TAROT_SOURCES.md.
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

/* Long-form card-specific foundations. These are original application prose,
   informed by traditional RWS themes rather than copied from reference sites. */
const MAJOR_LONG = {
"The Fool":[
"The Fool speaks of the beginning of a journey before its destination is known. It carries openness, curiosity, freedom, and the willingness to step beyond what is familiar. The card can describe a genuine leap of faith, especially when the value of beginning outweighs the comfort of certainty.",
"The reversed Fool can show a beginning approached without sufficient awareness, or a beginning that is being avoided because uncertainty feels uncomfortable. Its energy may be reckless, scattered, or inwardly blocked. The question is whether caution is protecting something important or simply preventing movement."
],
"The Magician":[
"The Magician represents focused will and the ability to turn intention into action. The tools are available, but they must be consciously directed. This card often asks what can be made real through skill, communication, initiative, and deliberate use of the resources already at hand.",
"The reversed Magician warns that ability and intention may not be working together cleanly. Skill can become manipulation, confidence can become performance, and potential can remain unused. Look for where energy is being scattered or where someone is trying to control an outcome through appearances rather than substance."
],
"The High Priestess":[
"The High Priestess points toward knowledge that is quiet, inward, and not yet completely visible. She favors observation over premature action and asks the reader to notice intuition, symbolism, dreams, omissions, and what is felt before it can be explained. Some answers need to be allowed to emerge.",
"The reversed High Priestess can indicate secrecy, confusion, suppressed intuition, or a refusal to listen to what is already known inwardly. Hidden information may be distorting the situation, or intuition may be overwhelmed by fear and projection. The remedy is not necessarily more action, but clearer listening."
],
"The Empress":[
"The Empress is the principle of growth made tangible: creation, nurture, fertility, abundance, beauty, and the patient cultivation of something living. She asks what can flourish when it receives attention and what must be protected long enough to mature.",
"The reversed Empress can show blocked creativity, depleted nurturing energy, dependence, or abundance that has become stagnation. Care may be misplaced or withheld, and generosity may be turning into overextension. The card asks what needs nourishment and what has become dependent on being continually supplied."
],
"The Emperor":[
"The Emperor represents order, boundaries, structure, authority, and the stabilizing power of deliberate leadership. He turns possibility into a framework that can endure. At his best he provides protection and direction; his lesson is that durable authority requires responsibility rather than domination.",
"The reversed Emperor can reveal rigidity, excessive control, domination, or a structure that has stopped serving the people inside it. Authority may be insecure beneath its hard exterior. The important question is whether order is creating stability or merely demanding obedience."
],
"The Hierophant":[
"The Hierophant represents received wisdom, teaching, tradition, ritual, and the institutions through which knowledge is transmitted. He can point to a mentor, established practice, community, or inherited belief system. His deeper question is what wisdom deserves to be learned before it is challenged.",
"The reversed Hierophant questions conformity and inherited authority. It can describe breaking from convention, discovering an unconventional teacher, or recognizing that a belief has become rigid rather than useful. It may also warn against rejecting tradition merely for the sake of rebellion."
],
"The Lovers":[
"The Lovers concerns union, attraction, relationship, shared values, and consequential choice. Its central theme is alignment: what you choose reveals what you value. The card can describe partnership, but it can also concern the difficult work of bringing desire, principle, and action into agreement.",
"The reversed Lovers can indicate divided values, disharmony, an unresolved choice, or a relationship in which the people involved are no longer moving from the same principles. Attraction alone may not resolve the conflict. The card asks what must be acknowledged before genuine alignment is possible."
],
"The Chariot":[
"The Chariot is determined movement. It brings opposing drives under conscious direction and advances through discipline, focus, and a willingness to take the reins. Victory here is less about effortless success than about maintaining direction when competing forces pull in different ways.",
"The reversed Chariot can show conflicting drives, loss of direction, impatience, or movement that has become forceful without being purposeful. A person may be trying to win while no longer knowing what winning is supposed to accomplish. Regaining direction matters more than simply increasing speed."
],
"Strength":[
"Strength describes mastery through patience, courage, compassion, and calm relationship with powerful instinct. Its strength is not brute force; it is the ability to meet intensity without being ruled by it. The card asks whether gentleness, confidence, and endurance can accomplish what force cannot.",
"The reversed Strength can show insecurity, self-doubt, suppressed emotion, or force used because inner confidence is lacking. Fear may be controlling behavior from underneath the surface. The card invites a return to steadiness and a more compassionate relationship with one's own power."
],
"The Hermit":[
"The Hermit turns away from noise in order to find a more reliable light within. He represents solitude, reflection, study, discernment, and wisdom gained through experience. His withdrawal is purposeful when it creates understanding; he asks what becomes visible when distraction is removed.",
"The reversed Hermit can become isolation, withdrawal without insight, or avoidance disguised as reflection. Someone may be hiding from connection, guidance, or an uncomfortable truth. Solitude is useful only when it eventually produces clearer understanding and a meaningful return to life."
],
"Wheel of Fortune":[
"The Wheel of Fortune marks movement in a cycle: circumstances turn, fortunes change, and conditions that seemed fixed reveal their temporary nature. It asks the reader to recognize timing and changing conditions rather than assuming that today's position will remain permanent.",
"The reversed Wheel can show resistance to a changing cycle, poor timing, instability, or the feeling of being caught in a pattern that repeats itself. It can also point to an opportunity being missed because the situation is being approached as though nothing has changed."
],
"Justice":[
"Justice brings truth, proportion, accountability, and consequence. It asks for an honest assessment in which actions and results are considered together. The card favors clarity over wishful thinking and reminds the reader that a fair decision depends on seeing the situation without deliberately omitting inconvenient facts.",
"The reversed Justice can indicate imbalance, denial, unfair treatment, distorted judgment, or avoidance of responsibility. The problem may not be that consequences are absent, but that someone is resisting an honest accounting of them. Clarity begins by naming what is actually happening."
],
"The Hanged Man":[
"The Hanged Man represents a voluntary pause and a change in perspective. Progress may require surrendering the expectation that the answer will come through immediate action. By suspending an old viewpoint, something previously overlooked can become visible.",
"The reversed Hanged Man can indicate needless delay, resistance to surrender, or remaining suspended without gaining a new perspective. A pause that once served a purpose may now be becoming avoidance. The question is what must finally be released so that movement can resume."
],
"Death":[
"Death is the card of endings that create transformation. It does not ordinarily mean literal death; it describes the completion of a form, relationship, identity, habit, or chapter so that something different can emerge. Its lesson is that renewal sometimes requires making peace with what cannot continue.",
"The reversed Death often shows resistance to an ending that has already become necessary, or difficulty allowing an old identity or pattern to pass away. The transition may therefore become prolonged. The card asks what is being held onto and what life could become if it were released."
],
"Temperance":[
"Temperance is the art of combining different elements without allowing either to overwhelm the whole. It represents moderation, healing, patience, proportion, and gradual integration. Its wisdom is practical: lasting change often comes from repeatedly finding the right measure rather than demanding an immediate extreme.",
"The reversed Temperance shows excess, impatience, poor mixture, or competing influences that have not found a workable balance. Something may be moving too quickly, too slowly, or in incompatible directions. Restoration begins by identifying which elements need less, which need more, and which need to be combined differently."
],
"The Devil":[
"The Devil brings attention to attachment, appetite, material desire, fear, compulsion, and the stories that make bondage appear inevitable. The card does not merely condemn desire; it asks what has gained power over choice. Recognizing the chain is the beginning of discovering whether it can be removed.",
"The reversed Devil can describe loosening an attachment, recognizing a destructive pattern, or beginning to reclaim agency. It can also show denial of an attachment that remains active. Freedom requires more than wanting release; it requires seeing honestly what continues to receive one's consent."
],
"The Tower":[
"The Tower represents sudden revelation, upheaval, and the collapse of a structure that could not remain stable. Its lightning exposes what was hidden and interrupts arrangements built on unstable foundations. Though disruptive, the card can clear away a false certainty and make honest rebuilding possible.",
"The reversed Tower can show resistance to an inevitable disruption, a crisis occurring inwardly rather than publicly, or a truth that is being postponed. The collapse may be delayed but the underlying instability remains. The card asks what would happen if the truth were faced before circumstances force the issue."
],
"The Star":[
"The Star follows upheaval with renewal, openness, hope, and a quieter kind of faith. It represents healing that becomes possible when the need for armor begins to lessen. The card encourages honest hope: not certainty that everything will happen as desired, but trust that meaning and direction can return.",
"The reversed Star can show depleted hope, discouragement, disconnection from inspiration, or difficulty believing that healing is possible. The light has not necessarily disappeared; the person may simply be unable to receive it. Small acts of restoration can matter more than demanding immediate confidence."
],
"The Moon":[
"The Moon moves through uncertainty, dreams, instinct, imagination, hidden fears, and incomplete information. It reminds the reader that perception can be vivid without being reliable. The task is to move carefully through ambiguity while distinguishing intuition from projection and fear from fact.",
"The reversed Moon can indicate confusion beginning to clear, hidden fears becoming visible, or distorted perceptions being recognized. It may also show that anxiety is still shaping interpretation even when more facts are available. Clarity grows through patient examination rather than forcing certainty too soon."
],
"The Sun":[
"The Sun brings illumination, vitality, confidence, joy, openness, and the relief of seeing something clearly. It favors directness and encourages life to be experienced rather than hidden behind unnecessary complexity. Success under the Sun is strongest when it is shared honestly rather than used merely for display.",
"The reversed Sun can indicate temporary clouding, delayed joy, excessive pride, or success that is harder to feel than it appears from outside. The underlying vitality remains available, but confidence may be uneven or expectations may be obscuring what is already good."
],
"Judgement":[
"Judgement is awakening, reckoning, recognition, and the call to answer what life is asking next. It looks back without being trapped by the past. The card can mark a moment when a truth becomes impossible to ignore and a person is invited to make a conscious decision about who they will become.",
"The reversed Judgement can show harsh self-judgment, avoidance of a necessary reckoning, or difficulty hearing a call to change. The past may be treated as a sentence rather than a source of understanding. The card asks whether guilt is preventing the honest renewal that recognition makes possible."
],
"The World":[
"The World represents completion, integration, achievement, and the sense that separate parts of a long process have finally come together. It is not merely an ending; it is the recognition of what has been learned and the readiness to stand in a new relationship with the whole experience.",
"The reversed World can indicate an unfinished cycle, incomplete closure, or difficulty recognizing how much has already been accomplished. Something may be almost complete but still lacks one final act of integration. The lesson is to identify what remains rather than repeatedly beginning again."
]
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

function cardTheme(card, orientation) {
    if (MAJOR_MEANINGS[card]) return MAJOR_MEANINGS[card][orientation === "Reversed" ? 1 : 0];
    const match = card.match(/^(Ace|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Page|Knight|Queen|King) of (Wands|Cups|Swords|Pentacles)$/);
    if (!match) return "an influence that deserves attention in this position";
    const index = orientation === "Reversed" ? 1 : 0;
    return `${RANK_MEANINGS[match[1]][index]} expressed through ${SUIT_MEANINGS[match[2]][index]}`;
}

function positionGuidance(position) {
    if (["challenge", "crosses"].includes(position)) return "In this position, consider what this card asks you to confront, understand, or respond to rather than treating the difficulty as a fixed verdict.";
    if (["guidance", "advice"].includes(position)) return "Here the card functions as guidance: consider how its healthiest qualities could become a deliberate response to the circumstances.";
    if (["outcome", "potential"].includes(position)) return "Here the card describes a direction rather than an unavoidable fate; the choices made in response to the reading can alter how that possibility develops.";
    if (["past", "recent", "behind"].includes(position)) return "Because this is a past-facing position, the card describes an influence that has already entered the story and whose effects may still be present.";
    if (["future", "near", "before", "developing"].includes(position)) return "Because this is a future-facing position, the card describes a developing possibility rather than a guaranteed event.";
    if (["you", "self", "other", "environment", "current"].includes(position)) return "Here the card can describe a role, attitude, behavior, relationship dynamic, or surrounding influence that is active in the matter.";
    return "The position gives this card its particular question, so its meaning should be read through this role rather than in isolation.";
}

function getInterpretation(spread, position, card, orientation) {
    const purpose = POSITION_PURPOSES[`${spread}:${position}`];
    if (!purpose) return null;
    const reversed = orientation === "Reversed";
    const index = reversed ? 1 : 0;
    if (MAJOR_LONG[card]) {
        const cardParagraph = MAJOR_LONG[card][index];
        const positional = `In the ${position.replaceAll("-", " ")} position, that traditional theme is being applied to ${purpose}.`;
        const orientationNote = reversed
            ? "Because the card is reversed, pay particular attention to where this energy is blocked, internalized, delayed, exaggerated, or expressed through its more difficult side."
            : "Because the card is upright, its central energy is available to operate more directly here, although the position determines exactly what aspect of it matters.";
        return `${cardParagraph} ${positional} ${positionGuidance(position)} ${orientationNote}`;
    }
    const theme = cardTheme(card, orientation);
    const orientationNote = reversed
        ? "Reversed, the card's energy may be blocked, delayed, internalized, distorted, exaggerated, or expressed through its more difficult side."
        : "Upright, the card's central theme is available to express itself more directly in this position.";
    return `${capitalize(theme)}. In this position, that points to ${purpose}. ${positionGuidance(position)} ${orientationNote}`;
}

function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
