import { useMemo } from "react";
import { Heart, MoonStar, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getDailyStats, getHistory, getJournalEntries } from "../utils/storage";

export default function Space() {
  const { history, journal, daily } = useMemo(
    () => ({ history: getHistory(), journal: getJournalEntries(), daily: getDailyStats() }),
    [],
  );
  const favorites = history.filter((record) => journal[record.id]?.favorite);
  return (
    <div className="page space-page">
      <div className="page-heading">
        <div className="eyebrow">KHÔNG GIAN CỦA BẠN</div>
        <h1>Hành trình chiêm nghiệm</h1>
        <p>Mọi dữ liệu được giữ trên thiết bị này, dành riêng cho bạn.</p>
      </div>
      <div className="space-stats">
        <article><Sparkles size={21}/><strong>{history.length}</strong><span>trải bài đã xem</span></article>
        <article><MoonStar size={21}/><strong>{daily.total}</strong><span>lá Daily Tarot</span></article>
        <article><Heart size={21}/><strong>{favorites.length}</strong><span>trải bài yêu thích</span></article>
        <article><Star size={21}/><strong>{daily.streak}</strong><span>ngày liên tiếp</span></article>
      </div>
      <section className="streak-panel">
        <div><span className="eyebrow">DAILY TAROT</span><h2>Chuỗi hiện tại: {daily.streak} ngày</h2><p>Kỷ lục của bạn là {daily.best} ngày. Mỗi ngày chỉ có một lá bài để bạn dừng lại và lắng nghe.</p></div>
        <Link className="button primary" to="/daily">Rút lá hôm nay</Link>
      </section>
      <section className="space-section">
        <div className="section-heading"><div><span className="eyebrow">YÊU THÍCH</span><h2>Những trải bài muốn giữ lại</h2></div><Link className="text-link" to="/history">Xem nhật ký</Link></div>
        {favorites.length ? <div className="favorite-list">{favorites.slice(0, 3).map((record) => <article key={record.id}><Heart size={16} fill="currentColor"/><div><strong>{record.question || "Thông điệp dành cho bạn"}</strong><span>{new Date(record.date).toLocaleDateString("vi-VN")}</span></div></article>)}</div> : <p className="muted">Bạn chưa đánh dấu trải bài nào. Hãy chọn biểu tượng trái tim ở phần Nhật ký Tarot sau khi xem kết quả.</p>}
      </section>
    </div>
  );
}
