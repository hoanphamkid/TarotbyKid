import { cardById } from "../data/tarotCards.js";
import { spreads } from "../data/options.js";
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function validRecord(r) {
  return (
    r &&
    typeof r.id === "string" &&
    typeof r.date === "string" &&
    typeof r.question === "string" &&
    spreads[r.spread] &&
    Array.isArray(r.cards) &&
    r.cards.length === spreads[r.spread].positions.length &&
    new Set(r.cards.map((c) => c.id)).size === r.cards.length &&
    r.cards.every(
      (c) => cardById[c.id] && ["upright", "reversed"].includes(c.orientation),
    )
  );
}
export function getHistory() {
  const value = readStorage("tarotHistory", []);
  return Array.isArray(value) ? value.filter(validRecord) : [];
}
export function saveHistory(record) {
  const rows = getHistory();
  return writeStorage(
    "tarotHistory",
    [record, ...rows.filter((r) => r.id !== record.id)].slice(0, 100),
  );
}
export function getDaily() {
  const row = readStorage(`dailyTarot_${localDay()}`, null);
  return validRecord(row) && row.spread === "single" ? row : null;
}
export function saveDaily(record) {
  return writeStorage(`dailyTarot_${localDay()}`, record);
}
