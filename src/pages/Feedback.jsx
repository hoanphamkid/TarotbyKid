import { useMemo } from "react";
import { Heart, MessageCircle, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeedback } from "../utils/storage";

export default function Feedback() {
  const feedback = useMemo(getFeedback, []);
  const helpful = feedback.filter((item) => item.rating === "helpful").length;
  return <div className="page feedback-page">
    <div className="page-heading"><div className="eyebrow">PHẢN HỒI</div><h1>Những điều được lưu lại</h1><p>Đây là bản thử nghiệm: phản hồi hiện được lưu trên thiết bị của bạn.</p></div>
    <div className="feedback-stats"><article><ThumbsUp size={21}/><strong>{helpful}</strong><span>thấy hữu ích</span></article><article><MessageCircle size={21}/><strong>{feedback.length}</strong><span>phản hồi đã gửi</span></article></div>
    {feedback.length ? <div className="feedback-list">{feedback.map((item) => <article key={item.id}><div><span className={item.rating === "helpful" ? "feedback-rating helpful" : "feedback-rating"}>{item.rating === "helpful" ? "Hữu ích" : "Chưa thực sự"}</span><time>{new Date(item.date).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}</time></div>{item.message && <p>{item.message}</p>}</article>)}</div> : <div className="empty-state"><Heart size={42} strokeWidth={1}/><h2>Chưa có phản hồi nào</h2><p>Sau khi xem một trải bài, bạn có thể gửi cảm nhận ở phần Nhật ký Tarot.</p><Link className="button primary" to="/reading">Rút bài Tarot</Link></div>}
  </div>;
}
