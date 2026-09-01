"use strict";

/*
 * Contextual Tarot Dataset
 *
 * This layer combines the application's 78-card Rider-Waite-Smith card
 * vocabulary with every supported spread position and both orientations.
 * It deliberately creates original contextual prose instead of copying
 * copyrighted modern tarot sites.
 *
 * Research foundation:
 * - A. E. Waite, The Pictorial Key to the Tarot (1911), public domain.
 * - Tarotoo Tarot Card Meanings dataset (2026), MIT License, used as a
 *   modern structured cross-check for upright/reversed card vocabulary.
 * - Pro Bono Tarot Guild, RWS cards in context, used as a modern reference
 *   for the principle that meanings change with spread position.
 *
 * Source links are retained here so the provenance of the interpretation
 * system remains visible in the project.
 */

const CONTEXTUAL_DATASET_META = {
    deck: "Rider-Waite-Smith",
    cardCount: 78,
    orientations: ["Upright", "Reversed"],
    sources: [
        "https://www.sacred-texts.com/tarot/pkt/index.htm",
        "https://tarotoo.com/open-data",
        "https://probonotarotguild.org/rider-waite-smith-tarot-meanings"
    ],
    note: "Original contextual prose generated from traditional card themes and spread-position functions; source wording is not reproduced."
};

function buildCardDataset() {
    const records = [];
    const majors = Object.keys(MAJOR_MEANINGS);

    majors.forEach((name, index) => {
        records.push({
            id: index,
            name,
            arcana: "major",
            upright: MAJOR_MEANINGS[name][0],
            reversed: MAJOR_MEANINGS[name][1]
        });
    });

    let id = 22;
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            records.push({
                id: id++,
                name: `${rank} of ${suit}`,
                arcana: "minor",
                suit,
                rank,
                upright: `${RANK_MEANINGS[rank][0]} expressed through ${SUIT_MEANINGS[suit][0]}`,
                reversed: `${RANK_MEANINGS[rank][1]} expressed through ${SUIT_MEANINGS[suit][1]}`
            });
        }
    }
    return records;
}

const TAROT_CONTEXTUAL_DATASET = buildCardDataset();

function contextualPositionLabel(spreadId, positionId) {
    const key = `${spreadId}:${positionId}`;
    return POSITION_PURPOSES[key] || "the question this position asks of the card";
}

function contextualOrientationText(orientation) {
    if (orientation === "Reversed") {
        return "Because the card is reversed, its energy should be considered as blocked, delayed, internalized, distorted, excessive, or otherwise difficult to express in its straightforward form. The reversal does not automatically make the card negative; it changes how the card's central theme is operating in this particular position.";
    }
    return "Because the card is upright, its central energy is available to express itself more directly. The position determines where that energy belongs in the reading, rather than changing the underlying identity of the card.";
}

function contextualTimeLanguage(positionId) {
    if (["past", "recent", "behind"].includes(positionId)) return "Looking backward, this card describes an influence that has already entered the story and may still be leaving its imprint on the present.";
    if (["future", "near", "before", "developing"].includes(positionId)) return "Looking forward, this card describes an influence that may become more visible as the situation develops; it is a direction of possibility, not a fixed guarantee.";
    return "In this position, the card describes an influence that belongs to the current structure of the question rather than simply predicting an event.";
}

function buildLongInterpretation(spreadId, positionId, card, orientation) {
    const record = TAROT_CONTEXTUAL_DATASET.find(item => item.name === card);
    if (!record) return null;

    const base = orientation === "Reversed" ? record.reversed : record.upright;
    const purpose = contextualPositionLabel(spreadId, positionId);
    const orientationText = contextualOrientationText(orientation);
    const timeText = contextualTimeLanguage(positionId);

    let positionText = `The card is being asked to speak about ${purpose}. That means its traditional theme should be read through that specific question. ${capitalize(base)}. Rather than treating that phrase as a prediction by itself, consider how the card's symbolism describes the way this influence is functioning here.`;

    if (positionId === "challenge" || positionId === "crosses") {
        positionText += ` As a challenge, the card points to the part of the situation that requires recognition, adjustment, restraint, or conscious effort. Its difficult expression may be the obstacle, while its healthier expression can show the quality needed to meet that obstacle.`;
    } else if (["guidance", "advice"].includes(positionId)) {
        positionText += ` As guidance, the card is less a command than a principle to consider. Ask what its upright or reversed qualities would look like as a deliberate choice, and what happens when that quality is overused, avoided, or misunderstood.`;
    } else if (["outcome", "potential"].includes(positionId)) {
        positionText += ` In an outcome or potential position, the card describes the direction produced by the forces already present. It is best understood as a likely pattern rather than an unavoidable fate, because choices and circumstances can alter how that pattern unfolds.`;
    } else if (["you", "self", "other", "environment", "current"].includes(positionId)) {
        positionText += ` In a person or present-circumstances position, the card can describe an attitude, role, behavior, or surrounding influence. Consider whether the card is showing what someone is doing, what they are experiencing, or the quality they are being asked to embody.`;
    } else {
        positionText += ` The position gives the card a specific job in the story, so the same card would carry a different emphasis if it appeared elsewhere in the spread.`;
    }

    return `${positionText} ${timeText} ${orientationText}`;
}

/* Replace the short placeholder interpretation with the full contextual dataset lookup. */
window.getInterpretation = buildLongInterpretation;
window.TAROT_CONTEXTUAL_DATASET = TAROT_CONTEXTUAL_DATASET;
window.CONTEXTUAL_DATASET_META = CONTEXTUAL_DATASET_META;
