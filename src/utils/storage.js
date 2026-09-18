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

export function getJournalEntry(recordId) {
  const entries = readStorage("tarotJournal", {});
  return entries && typeof entries === "object" ? entries[recordId] || {} : {};
}

export function saveJournalEntry(recordId, patch) {
  const entries = readStorage("tarotJournal", {});
  const next = {
    ...(entries && typeof entries === "object" ? entries : {}),
    [recordId]: { ...getJournalEntry(recordId), ...patch, updatedAt: new Date().toISOString() },
  };
  return writeStorage("tarotJournal", next);
}

export function getJournalEntries() {
  const entries = readStorage("tarotJournal", {});
  return entries && typeof entries === "object" ? entries : {};
}

export function getDailyStats() {
  try {
    const days = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith("dailyTarot_")) continue;
      const date = key.replace("dailyTarot_", "");
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && validRecord(readStorage(key, null))) days.push(date);
    }
    const uniqueDays = [...new Set(days)].sort();
    let streak = 0;
    const cursor = new Date();
    while (uniqueDays.includes(localDay(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    let best = 0;
    let run = 0;
    let previous = null;
    for (const day of uniqueDays) {
      const current = new Date(`${day}T00:00:00`);
      const expected = previous ? new Date(previous) : null;
      if (expected) expected.setDate(expected.getDate() + 1);
      run = expected && current.getTime() === expected.getTime() ? run + 1 : 1;
      best = Math.max(best, run);
      previous = current;
    }
    return { total: uniqueDays.length, streak, best };
  } catch {
    return { total: 0, streak: 0, best: 0 };
  }
}
