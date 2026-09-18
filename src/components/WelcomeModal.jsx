import { useEffect, useRef, useState } from "react";
import { Moon, Sparkles, X } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(true);
  const closeButton = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return <Analytics />;
  return (
    <>
      <Analytics />
      <div
        className="welcome-overlay"
        role="presentation"
        onMouseDown={() => setOpen(false)}
      >
        <section
          className="welcome-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            ref={closeButton}
            className="welcome-close"
            type="button"
            aria-label="Đóng lời chào"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
          <div className="welcome-symbols" aria-hidden="true">
            <Sparkles size={17} />
            <Moon size={19} />
            <span>✦</span>
          </div>
          <div className="eyebrow">HPTAROT</div>
          <h1 id="welcome-title">✦ Chào mừng đến với HPTAROT ✦</h1>
          <p>Xin chào, mình là Hoàn Phạm.</p>
          <p>
            HPTAROT là một không gian Tarot nhỏ được tạo ra để giúp bạn khám phá
            những góc nhìn mới về bản thân, tình cảm, công việc và cuộc sống.
          </p>
          <p>
            Bạn có thể rút bài Tarot theo chủ đề, xem Daily Tarot, khám phá ý
            nghĩa 78 lá bài và lưu lại những trải bài của riêng mình.
          </p>
          <blockquote>
            “Tarot không quyết định tương lai - hãy xem đây như một góc nhìn để
            bạn hiểu bản thân rõ hơn.”
          </blockquote>
          <button
            type="button"
            className="button primary welcome-start"
            onClick={() => setOpen(false)}
          >
            Bắt đầu hành trình ✨
          </button>
        </section>
      </div>
    </>
  );
}
