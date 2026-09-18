import { useState } from "react";
import { Link } from "react-router-dom";
import { Share2, ArrowRight, BookmarkCheck } from "lucide-react";
import { cardById } from "../data/tarotCards";
import { interpretTarot } from "../services/tarotEngine";
import { CardBack, CardImage } from "./Card";

export default function ReadingResult({ record, saved = true, daily = false }) {
  const [notice, setNotice] = useState("");
  const baseline = interpretTarot(record);
  const reading = {
    ...baseline,
    ...(typeof record.reading?.aiNarrative === "string"
      ? { aiNarrative: record.reading.aiNarrative }
      : {}),
    aiFallback: record.reading?.aiFallback,
  };
  async function share() {
    const text = `HoanPhamTarot\n${record.question || "Thông điệp dành cho bạn"}\n${record.cards.map((c) => `${cardById[c.id].name} (${c.orientation === "reversed" ? "Ngược" : "Xuôi"})`).join(", ")}\n${reading.message}\n${reading.advice}`;
    try {
      if (navigator.share)
        await navigator.share({ title: "HoanPhamTarot", text });
      else {
        await navigator.clipboard.writeText(text);
        setNotice("Đã sao chép kết quả.");
      }
    } catch (e) {
      if (e.name !== "AbortError")
        setNotice(
          "Không thể chia sẻ tự động. Bạn có thể chọn và sao chép nội dung kết quả.",
        );
    }
  }
  return (
    <div className="result">
      <div className="page-heading">
        <div className="eyebrow">MỘT GÓC NHÌN DÀNH CHO BẠN</div>
        <h1>{daily ? "Thông điệp hôm nay" : "Những lá bài đã lên tiếng"}</h1>
        {record.question && (
          <p className="question-quote">“{record.question}”</p>
        )}
        <span className="muted">
          {new Date(record.date).toLocaleString("vi-VN")}
        </span>
      </div>
      <div className="result-cards">
        {record.cards.map((c, i) => (
          <div className="result-card" key={c.id}>
            <span className="position">{reading.details[i].position}</span>
            <div className="flip-scene">
              <div
                className="flip-inner"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <div className="flip-back">
                  <CardBack />
                </div>
                <div className="flip-front">
                  <CardImage
                    card={cardById[c.id]}
                    orientation={c.orientation}
                    eager
                  />
                </div>
              </div>
            </div>
            <h3>{cardById[c.id].name}</h3>
            <p>{cardById[c.id].vietnameseName}</p>
            <span className={`orientation ${c.orientation}`}>
              {c.orientation === "upright" ? "LÁ XUÔI" : "LÁ NGƯỢC"}
            </span>
          </div>
        ))}
      </div>
      <div className="reading-copy">
        {reading.yesNo && (
          <div className="answer">
            <span>GÓC NHÌN YES / NO</span>
            <h2>{reading.yesNo}</h2>
            <p>Một xu hướng để cân nhắc, không phải kết luận chắc chắn.</p>
          </div>
        )}
        <section>
          <span className="eyebrow">01 · TỔNG QUAN</span>
          <h2>Bức tranh của trải bài</h2>
          <p>{reading.overview}</p>
          <p>{reading.focusSummary}</p>
        </section>
        <section>
          <span className="eyebrow">02 · TỪNG LÁ BÀI</span>
          {reading.details.map((d, i) => (
            <article className="card-meaning" key={d.id}>
              <span className="meaning-number">0{i + 1}</span>
              <div>
                <h3>
                  {cardById[d.id].name} <span>· {d.position}</span>
                </h3>
                <div className="keywords">
                  {cardById[d.id].keywords.map((k) => (
                    <span key={k}>{k}</span>
                  ))}
                </div>
                <p>{d.meaning}</p>
                <p>{d.application}</p>
                <p className="position-note">{d.positionMeaning}</p>
                <p>{d.advice}</p>
              </div>
            </article>
          ))}
        </section>
        <section>
          <span className="eyebrow">03 · SỰ KẾT NỐI</span>
          <h2>Khi các lá bài cùng kể chuyện</h2>
          {reading.connections.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
        <section>
          <span className="eyebrow">04 · THÔNG ĐIỆP CHÍNH</span>
          <h2>Điều dành cho bạn lúc này</h2>
          <p>{reading.message}</p>
          <p>{reading.conclusion}</p>
        </section>
        <section>
          <span className="eyebrow">05 · ĐIỀU NÊN CHÚ Ý</span>
          <p>{reading.attention}</p>
        </section>
        <section className="advice">
          <span className="eyebrow">06 · LỜI KHUYÊN</span>
          <h2>{reading.advice}</h2>
        </section>
        {reading.aiNarrative && (
          <section>
            <h2>Góc nhìn mở rộng</h2>
            <p className="whitespace-pre-line">{reading.aiNarrative}</p>
          </section>
        )}
        {reading.aiFallback && (
          <p role="status">
            AI hiện không khả dụng. Kết quả trên được giải bằng bộ quy tắc
            Tarot.
          </p>
        )}
        <div className="result-actions">
          <span className="saved">
            <BookmarkCheck size={17} />
            {saved ? "Đã lưu trên thiết bị" : "Không thể lưu trên thiết bị này"}
          </span>
          <button className="button primary" onClick={share}>
            <Share2 size={16} />
            Chia sẻ kết quả
          </button>
          <Link className="button ghost" to={`/reading?new=${record.id}`}>
            Trải bài mới <ArrowRight size={16} />
          </Link>
        </div>
        <p role="status">{notice}</p>
      </div>
    </div>
  );
}
