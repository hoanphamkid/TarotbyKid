import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookmarkCheck, Check, Share2, Sparkles } from "lucide-react";
import { cardById } from "../data/tarotCards";
import { interpretTarot } from "../services/tarotEngine";
import { CardImage } from "./Card";
import JournalPanel from "./JournalPanel";

const text = (value, fallback = "") => typeof value === "string" && value.trim() ? value : fallback;

export default function ReadingResult({ record, saved = true }) {
  const [step, setStep] = useState(0);
  const [deepDive, setDeepDive] = useState("");
  const [notice, setNotice] = useState("");
  const baseline = useMemo(() => interpretTarot(record), [record]);
  const reading = { ...baseline, ...(record.reading || {}) };
  const cards = record.cards || [], first = cards[0] || {}, firstCard = cardById[first.id], detail = reading.details?.[0] || {};
  const keywords = [...new Set(cards.flatMap((item) => cardById[item.id]?.keywords || []))].slice(0, 3);
  const mainMessage = text(reading.mainMessage, text(reading.message, detail.meaning));
  const readerMessage = text(reading.readerMessage, text(reading.focusSummary, detail.application));
  const questionInsight = text(reading.questionInsight, text(reading.attention, reading.overview));
  const actions = Array.isArray(reading.actions) && reading.actions.length ? reading.actions : cards.map((item, i) => reading.details?.[i]?.advice).filter(Boolean).slice(0, 3);
  async function share() {
    const value = `HoanPhamTarot\n${record.question || "Thông điệp dành cho bạn"}\n${cards.map((c) => `${cardById[c.id]?.name} (${c.orientation})`).join(", ")}\n${mainMessage}`;
    try { if (navigator.share) await navigator.share({ title: "HoanPhamTarot", text: value }); else { await navigator.clipboard.writeText(value); setNotice("Đã sao chép kết quả."); } } catch (error) { if (error.name !== "AbortError") setNotice("Không thể chia sẻ tự động."); }
  }
  return <div className="reading-experience">
    <header className="reading-progress"><span>TRẢI BÀI CỦA BẠN</span><div>{[0,1,2,3,4].map((item) => <i className={item <= step ? "active" : ""} key={item} />)}</div><small>{Math.min(step + 1, 5)} / 5</small></header>
    <main className="reading-stage" key={step}>
      {step === 0 && firstCard && <section className="reveal-screen"><span className="eyebrow">✦ THÔNG ĐIỆP DÀNH CHO BẠN</span><button className="hero-card" onClick={() => setStep(1)} aria-label="Mở lá bài"><CardImage card={firstCard} orientation={first.orientation} eager /></button><h1>{firstCard.name}</h1><p className="card-subtitle">{firstCard.vietnameseName}</p>{first.orientation === "reversed" && <span className="orientation-badge">NGƯỢC</span>}<button className="button ghost reveal-cta" onClick={() => setStep(1)}>Chạm để khám phá <ArrowRight size={16} /></button></section>}
      {step === 1 && <section className="story-screen"><span className="eyebrow">ĐIỀU ĐẦU TIÊN MÌNH CHÚ Ý...</span><blockquote>{mainMessage}</blockquote><button className="button primary" onClick={() => setStep(2)}>Tiếp tục <ArrowRight size={16} /></button></section>}
      {step === 2 && <section className="story-screen interpretation-screen"><span className="eyebrow">LÁ BÀI ĐANG GỢI Ý GÌ?</span><h1>Có một điều khá rõ ở đây...</h1><p>{readerMessage}</p><p>{detail.meaning}</p><div className="keyword-flow"><span>ĐIỀU ĐANG NỔI BẬT</span><div>{keywords.map((word) => <strong key={word}>{word}</strong>)}</div></div><button className="button primary" onClick={() => setStep(3)}>Nhìn sâu hơn <ArrowRight size={16} /></button></section>}
      {step === 3 && <section className="story-screen deep-dive-screen"><span className="eyebrow">VỚI CÂU HỎI CỦA BẠN...</span>{record.question && <blockquote>“{record.question}”</blockquote>}<p>{questionInsight}</p><h2>Bạn muốn nhìn sâu hơn vào điều gì?</h2><div className="dive-options">{[["emotion","♡","Cảm xúc",reading.emotion],["hiddenInsight","◉","Điều bạn chưa nhìn thấy",reading.hiddenInsight],["actions","✦","Bạn nên làm gì",actions.join(" ")]].map(([id, icon, label]) => <button key={id} className={deepDive === id ? "selected" : ""} onClick={() => setDeepDive(id)}><span>{icon}</span>{label}{deepDive === id && <Check size={15} />}</button>)}</div>{deepDive && <div className="dive-result"><span className="eyebrow">{deepDive === "actions" ? "HÔM NAY HÃY THỬ" : "MỘT GÓC NHÌN KHÁC"}</span>{deepDive === "actions" ? actions.map((item, i) => <p className="action-line" key={item}><b>0{i + 1}</b>{item}</p>) : <p>{text(deepDive === "emotion" ? reading.emotion : reading.hiddenInsight, questionInsight)}</p>}</div>}<button className="button primary" onClick={() => setStep(4)} disabled={!deepDive}>Điều mình muốn mang theo <ArrowRight size={16} /></button></section>}
      {step === 4 && <section className="story-screen takeaway-screen"><Sparkles size={22} /><span className="eyebrow">MỘT ĐIỀU ĐỂ MANG THEO</span><blockquote>{text(reading.takeaway, reading.conclusion)}</blockquote><p>Hãy để lời nhắc này ở lại với bạn theo cách nhẹ nhàng nhất.</p><div className="result-actions"><span className="saved"><BookmarkCheck size={16} />{saved ? "Đã lưu trên thiết bị" : "Chưa thể lưu"}</span><button className="button primary" onClick={share}><Share2 size={16} /> Chia sẻ</button><Link className="button ghost" to={`/reading?new=${record.id}`}>Trải bài mới <ArrowRight size={16} /></Link></div><JournalPanel record={record} /><p role="status">{notice}</p></section>}
    </main>{step > 0 && step < 4 && <button className="text-link reading-back" onClick={() => setStep(step - 1)}><ArrowLeft size={15} /> Quay lại</button>}{reading.aiFallback && <p className="reading-note">AI hiện không khả dụng; đây là diễn giải từ bộ quy tắc Tarot.</p>}
  </div>;
}
