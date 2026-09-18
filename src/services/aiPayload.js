import { cardById } from "../data/tarotCards.js";
import { categories, loveCategories, spreads } from "../data/options.js";

function topicFor(category) {
  if (loveCategories.includes(category)) return "love";
  if (["career", "study"].includes(category)) return "career";
  if (category === "finance") return "finance";
  return "general";
}

export function buildAiReadingPayload(input, interpretation) {
  const spreadId = input.spreadType || input.spread || "single";
  const spread = spreads[spreadId];
  const topic = topicFor(input.category);
  const cards = input.cards.map((selected, index) => {
    const card = cardById[selected.id];
    const meanings = card[selected.orientation];
    return {
      name: card.name,
      vietnameseName: card.vietnameseName,
      orientation: selected.orientation,
      position: spread.positions[index],
      arcana: card.arcana,
      suit: card.suit,
      keywords: card.keywords,
      meanings: {
        general: meanings.general,
        topic: meanings[topic],
        advice: meanings.advice,
      },
    };
  });
  const suitCounts = cards.reduce(
    (counts, card) => {
      if (card.suit) counts[card.suit] += 1;
      return counts;
    },
    { Cups: 0, Swords: 0, Wands: 0, Pentacles: 0 },
  );

  return {
    question: input.question.trim(),
    category: {
      id: input.category,
      label:
        categories.find(([id]) => id === input.category)?.[1] || input.category,
    },
    context: input.context || "Không cung cấp",
    intent: input.question.trim() || "Khám phá góc nhìn cho hiện tại",
    questionAnalysis: input.questionAnalysis,
    spread: { id: spreadId, name: spread.name, positions: spread.positions },
    cards,
    analysis: {
      majorCount: cards.filter((card) => card.arcana === "Major").length,
      suitCounts,
      reversedCount: cards.filter((card) => card.orientation === "reversed")
        .length,
      combinations: interpretation.connections.filter((item) =>
        item.includes(" + "),
      ),
      systemConnections: interpretation.connections,
      yesNo: interpretation.yesNo,
    },
  };
}
