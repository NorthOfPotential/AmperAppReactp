import { useNavigate, useParams } from "react-router-dom";
import { getCard } from "../data/cardsData";

export default function ComicPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const card = cardId ? getCard(cardId) : undefined;

  if (!card) return null;

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1>{card.cardName} — Comic</h1>
      </div>
      <div className="screen-body">
        <div className="comic-list">
          {card.comicStripes.map((img, idx) => (
            <img key={img} src={img} alt={`${card.cardName} panel ${idx + 1}`} loading="lazy" />
          ))}
        </div>
      </div>
    </div>
  );
}
