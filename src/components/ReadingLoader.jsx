import { CardImage } from "./Card";

export default function ReadingLoader({ deck, selected }) {
  return (
    <div className="reading-loader" role="status" aria-live="polite">
      <div className="loader-cards" aria-hidden="true">
        {selected.map((index, position) => (
          <div
            className={`loader-card loader-card-${position + 1}`}
            key={deck[index].id}
          >
            <CardImage
              card={deck[index]}
              orientation={position % 2 ? "reversed" : "upright"}
              eager
            />
          </div>
        ))}
      </div>
      <div className="loader-overlay">
        <span className="loader-spinner" aria-hidden="true" />
        <h2>Vũ trụ đang giải mã thông điệp từ các lá bài của bạn...</h2>
        <p>Hãy hít thở sâu và giữ tâm trí cởi mở</p>
      </div>
    </div>
  );
}
