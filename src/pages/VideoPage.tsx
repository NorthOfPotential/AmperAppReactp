import { useNavigate, useParams } from "react-router-dom";
import { getCard } from "../data/cardsData";

export default function VideoPage() {
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
        <h1>{card.cardName} — Video</h1>
      </div>
      <div className="screen-body" style={{ display: "flex", justifyContent: "center" }}>
        <video
          src={card.videoUrl}
          controls
          autoPlay
          style={{ width: "100%", maxWidth: 720, borderRadius: 14, background: "#000" }}
        />
      </div>
    </div>
  );
}
