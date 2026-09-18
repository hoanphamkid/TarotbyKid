import { useState } from "react";
import { Clock3, Heart, NotebookPen } from "lucide-react";
import { getFeedback, getJournalEntry, saveFeedback, saveJournalEntry } from "../utils/storage";

const moods = [["clear", "Rõ hơn"], ["calm", "Bình tâm"], ["thinking", "Cần suy ngẫm"]];

export default function JournalPanel({ record }) {
  const [entry, setEntry] = useState(() => getJournalEntry(record.id));
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(() => getFeedback().some((item) => item.recordId === record.id));
  const [feedbackNotice, setFeedbackNotice] = useState("");
  const update = (patch) => {
    setEntry((current) => ({ ...current, ...patch }));
    saveJournalEntry(record.id, patch);
  };
  const scheduleFollowUp = () => {
    const followUpAt = new Date();
    followUpAt.setDate(followUpAt.getDate() + 7);
    update({ followUpAt: followUpAt.toISOString() });
  };
  const submitFeedback = () => {
    if (submitted || getFeedback().some((item) => item.recordId === record.id)) {
      setSubmitted(true);
      setFeedbackNotice("Bạn đã gửi phản hồi cho trải bài này rồi.");
      return;
    }
    if (!entry.feedback) {
      setFeedbackNotice("Hãy chọn một đánh giá trước khi gửi.");
      return;
    }
    const date = new Date();
    saveFeedback({ id: crypto.randomUUID(), recordId: record.id, rating: entry.feedback, message: feedbackText.trim(), date: date.toISOString() });
    setSubmitted(true);
    setFeedbackText("");
    setFeedbackNotice(`Đã gửi phản hồi lúc ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}. Cảm ơn bạn.`);
  };
  return (
    <section className="journal-panel" aria-labelledby="journal-title">
      <div className="journal-heading"><NotebookPen size={20} /><div><span className="eyebrow">NHẬT KÝ TAROT</span><h2 id="journal-title">Khoảnh khắc này nói gì với bạn?</h2></div></div>
      <div className="mood-options" role="group" aria-label="Cảm nhận sau trải bài">
        {moods.map(([id, label]) => <button type="button" key={id} className={entry.mood === id ? "selected" : ""} aria-pressed={entry.mood === id} onClick={() => update({ mood: entry.mood === id ? "" : id })}>{label}</button>)}
      </div>
      <div className="journal-feedback" role="group" aria-label="Đánh giá trải bài">
        <span>Trải bài này có hữu ích với bạn không?</span>
        <button type="button" disabled={submitted} className={entry.feedback === "helpful" ? "selected" : ""} aria-pressed={entry.feedback === "helpful"} onClick={() => update({ feedback: "helpful" })}>Có</button>
        <button type="button" disabled={submitted} className={entry.feedback === "not-yet" ? "selected" : ""} aria-pressed={entry.feedback === "not-yet"} onClick={() => update({ feedback: "not-yet" })}>Chưa thực sự</button>
      </div>
      <div className="feedback-compose">
        <label htmlFor={`feedback-${record.id}`}>Bạn muốn góp ý thêm?</label>
        <textarea id={`feedback-${record.id}`} rows={3} maxLength={400} disabled={submitted} value={feedbackText} onChange={(event) => setFeedbackText(event.target.value)} placeholder="Viết một phản hồi ngắn, không cần để lại thông tin cá nhân." />
        <div><button type="button" className="button primary" disabled={submitted} onClick={submitFeedback}>{submitted ? "Đã gửi phản hồi" : "Gửi phản hồi"}</button><span className={feedbackNotice ? "feedback-notice" : ""} role="status" aria-live="polite">{feedbackNotice}</span></div>
      </div>
      <div className="journal-actions">
        <button type="button" className={entry.favorite ? "journal-toggle active" : "journal-toggle"} aria-pressed={Boolean(entry.favorite)} onClick={() => update({ favorite: !entry.favorite })}><Heart size={16} fill={entry.favorite ? "currentColor" : "none"} />{entry.favorite ? "Đã yêu thích" : "Yêu thích"}</button>
        <button type="button" className="journal-toggle" onClick={scheduleFollowUp}><Clock3 size={16} />{entry.followUpAt ? "Đã nhắc xem lại" : "Xem lại sau 7 ngày"}</button>
      </div>
    </section>
  );
}
