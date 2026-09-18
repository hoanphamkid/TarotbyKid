import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  History as HistoryIcon,
  ArrowLeft,
  ArrowUpRight,
  Heart,
  Clock3,
} from "lucide-react";
import { getHistory, getJournalEntries, writeStorage } from "../utils/storage";
import { cardById } from "../data/tarotCards";
import { spreads } from "../data/options";
import ReadingResult from "../components/ReadingResult";
export default function History() {
  const [rows, setRows] = useState(getHistory);
  const [journal, setJournal] = useState(getJournalEntries);
  const [view, setView] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  function update(next) {
    if (writeStorage("tarotHistory", next)) {
      setRows(next);
      setError("");
    } else setError("Không thể cập nhật lịch sử trên thiết bị này.");
  }
  if (view)
    return (
      <div className="page">
        <button className="text-link" onClick={() => { setJournal(getJournalEntries()); setView(null); }}>
          <ArrowLeft size={16} />
          Về lịch sử
        </button>
        <ReadingResult record={view} />
      </div>
    );
  return (
    <div className="page">
      <div className="page-heading">
        <div className="eyebrow">NHỮNG KHOẢNH KHẮC ĐÃ QUA</div>
        <h1>Nhật ký chiêm nghiệm</h1>
        <p>Lịch sử Tarot được lưu trên thiết bị của bạn.</p>
      </div>
      {rows.length > 0 ? (
        <>
          <div className="history-toolbar">
            <span>{rows.length} trải bài</span>
            <button className="text-link" onClick={() => setConfirm(true)}>
              <Trash2 size={16} />
              Xóa toàn bộ lịch sử
            </button>
          </div>
          {confirm && (
            <div className="confirm-bar" role="alert">
              <span>Xóa toàn bộ lịch sử? Lá bài hôm nay vẫn được giữ.</span>
              <button
                className="button danger"
                onClick={() => {
                  update([]);
                  setConfirm(false);
                }}
              >
                Xác nhận xóa
              </button>
              <button
                className="button ghost"
                onClick={() => setConfirm(false)}
              >
                Hủy
              </button>
            </div>
          )}
          <div className="history-list">
            {rows.map((r) => (
              <article className="history-row" key={r.id}>
                <div>
                  <span className="eyebrow">
                    {new Date(r.date).toLocaleString("vi-VN")}
                  </span>
                  <h3>{r.question || spreads[r.spread].name}</h3>
                  <p>
                    {r.cards
                      .map(
                        (c) =>
                          `${cardById[c.id].name}${c.orientation === "reversed" ? " (ngược)" : ""}`,
                      )
                      .join(" · ")}
                  </p>
                  <div className="history-meta">
                    {journal[r.id]?.favorite && <span><Heart size={13} fill="currentColor" /> Yêu thích</span>}
                    {journal[r.id]?.followUpAt && new Date(journal[r.id].followUpAt) <= new Date() && <span><Clock3 size={13} /> Đã đến lúc xem lại</span>}
                  </div>
                </div>
                <button className="button ghost" onClick={() => setView(r)}>
                  Xem lại <ArrowUpRight size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Xóa trải bài ${r.question || spreads[r.spread].name}`}
                  title="Xóa trải bài"
                  onClick={() => update(rows.filter((x) => x.id !== r.id))}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <HistoryIcon size={46} strokeWidth={1} />
          <h2>Hành trình của bạn bắt đầu từ đây</h2>
          <p>Những trải bài đã xem sẽ xuất hiện trong nhật ký này.</p>
          <Link className="button primary" to="/reading">
            Rút lá bài đầu tiên <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
      <p role="alert">{error}</p>
    </div>
  );
}
