import { useState } from "react";
import { Clock3, Heart, NotebookPen, Save } from "lucide-react";
import { getJournalEntry, saveJournalEntry } from "../utils/storage";

const moods = [
  ["clear", "Rõ hơn"],
  ["calm", "Bình tâm"],
  ["thinking", "Cần suy ngẫm"],
];

export default function JournalPanel({ record }) {
  const [entry, setEntry] = useState(() => getJournalEntry(record.id));
  const [saved, setSaved] = useState("");
  const update = (patch) => {
    const next = { ...entry, ...patch };
    setEntry(next);
    saveJournalEntry(record.id, patch);
    setSaved("Đã lưu");
  };
  const scheduleFollowUp = () => {
    const followUpAt = new Date();
    followUpAt.setDate(followUpAt.getDate() + 7);
    update({ followUpAt: followUpAt.toISOString() });
  };
  return (
    <section className="journal-panel" aria-labelledby="journal-title">
      <div className="journal-heading">
        <NotebookPen size={20} />
        <div>
          <span className="eyebrow">NHẬT KÝ TAROT</span>
          <h2 id="journal-title">Khoảnh khắc này nói gì với bạn?</h2>
        </div>
      </div>
      <div className="mood-options" role="group" aria-label="Cảm nhận sau trải bài">
        {moods.map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={entry.mood === id ? "selected" : ""}
            aria-pressed={entry.mood === id}
            onClick={() => update({ mood: entry.mood === id ? "" : id })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="journal-feedback" role="group" aria-label="Đánh giá trải bài">
        <span>Trải bài này có hữu ích với bạn không?</span>
        <button type="button" className={entry.feedback === "helpful" ? "selected" : ""} aria-pressed={entry.feedback === "helpful"} onClick={() => update({ feedback: "helpful" })}>Có</button>
        <button type="button" className={entry.feedback === "not-yet" ? "selected" : ""} aria-pressed={entry.feedback === "not-yet"} onClick={() => update({ feedback: "not-yet" })}>Chưa thực sự</button>
      </div>
      <label htmlFor={`journal-${record.id}`}>Ghi chú riêng của bạn</label>
      <textarea
        id={`journal-${record.id}`}
        rows={4}
        maxLength={800}
        value={entry.note || ""}
        placeholder="Điều nào trong trải bài khiến bạn dừng lại suy nghĩ?"
        onChange={(event) => setEntry({ ...entry, note: event.target.value })}
        onBlur={() => update({ note: entry.note || "" })}
      />
      <div className="journal-actions">
        <button
          type="button"
          className={entry.favorite ? "journal-toggle active" : "journal-toggle"}
          aria-pressed={Boolean(entry.favorite)}
          onClick={() => update({ favorite: !entry.favorite })}
        >
          <Heart size={16} fill={entry.favorite ? "currentColor" : "none"} />
          {entry.favorite ? "Đã yêu thích" : "Yêu thích"}
        </button>
        <button type="button" className="journal-toggle" onClick={scheduleFollowUp}>
          <Clock3 size={16} />
          {entry.followUpAt ? "Đã nhắc xem lại" : "Xem lại sau 7 ngày"}
        </button>
        <button type="button" className="journal-save" onClick={() => update({ note: entry.note || "" })}>
          <Save size={16} /> Lưu ghi chú
        </button>
        <span aria-live="polite">{saved}</span>
      </div>
    </section>
  );
}
