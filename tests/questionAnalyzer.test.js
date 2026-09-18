import test from "node:test";
import assert from "node:assert/strict";
import { analyzeQuestion } from "../src/services/questionAnalyzer.js";

test("normalizes Vietnamese chat shorthand and understands an ex relationship question", () => {
  const analysis = analyzeQuestion({
    question: "nyc con tc vs t k",
    selectedCategory: "love",
    selectedContext: "Người yêu cũ",
    spread: "timeline-3",
  });
  assert.match(analysis.normalizedQuestion, /người yêu cũ/i);
  assert.equal(analysis.category, "love");
  assert.equal(analysis.primaryIntent, "feelings");
  assert.equal(analysis.subject, "ex");
  assert.equal(analysis.yesNo, true);
});

test("question content can override a mismatched selected category", () => {
  const analysis = analyzeQuestion({
    question: "Tôi không còn yêu công việc hiện tại, có nên nghỉ không?",
    selectedCategory: "love",
    selectedContext: "",
    spread: "timeline-3",
  });
  assert.equal(analysis.category, "career");
  assert.equal(analysis.primaryIntent, "decision");
});

test("recognizes timeframe, finance, crush, and selected context for short questions", () => {
  const finance = analyzeQuestion({
    question: "3 thang toi tcinh ntn",
    selectedCategory: "general",
    selectedContext: "",
    spread: "timeline-3",
  });
  assert.equal(finance.category, "finance");
  assert.equal(finance.primaryIntent, "future_trend");
  assert.equal(finance.timeframe, "next_3_months");
  const crush = analyzeQuestion({
    question: "cr co thich t k",
    selectedCategory: "love",
    selectedContext: "Crush",
    spread: "timeline-3",
  });
  assert.equal(crush.subject, "crush");
  assert.equal(crush.primaryIntent, "feelings");
  const short = analyzeQuestion({
    question: "co co hoi khong?",
    selectedCategory: "love",
    selectedContext: "Người yêu cũ",
    spread: "timeline-3",
  });
  assert.equal(short.primaryIntent, "reconciliation");
  assert.equal(short.subject, "ex");
});
