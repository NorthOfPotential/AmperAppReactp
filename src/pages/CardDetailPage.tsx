import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCard } from "../data/cardsData";
import { useAuth } from "../state/AuthContext";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

export default function CardDetailPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const card = cardId ? getCard(cardId) : undefined;
  const [flipped, setFlipped] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  if (!card) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ‹
          </button>
          <h1>Card not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1>{card.cardName}</h1>
      </div>
      <div className="screen-body card-detail">
        <div
          className={`flip-card ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-face">
              {card.frontImage && <img src={card.frontImage} alt={`${card.cardName} front`} />}
            </div>
            <div className="flip-card-face flip-card-back">
              {card.backImage && <img src={card.backImage} alt={`${card.cardName} back`} />}
            </div>
          </div>
        </div>
        <span className="flip-hint">Tap the card to flip it</span>

        <div className="card-text-panel">{flipped ? card.backText : card.frontText}</div>

        <div className="card-detail-actions">
          {card.videoUrl && (
            <button className="action-pill" onClick={() => navigate(`/card/${card.id}/video`)}>
              🎬 Watch video
            </button>
          )}
          {card.templateImages.length > 0 && (
            <button className="action-pill" onClick={() => navigate(`/card/${card.id}/template`)}>
              📄 Templates
            </button>
          )}
          {card.comicStripes.length > 0 && (
            <button className="action-pill" onClick={() => navigate(`/card/${card.id}/comic`)}>
              💬 Comic
            </button>
          )}
          {card.swapCardId && (
            <button
              className="action-pill"
              onClick={() => navigate(`/card/${card.swapCardId}`, { replace: true })}
            >
              🔁 Swap card
            </button>
          )}
          {!isGuest && (
            <button className="action-pill" onClick={() => setShowAddToPlaylist(true)}>
              ➕ Add to mixtape
            </button>
          )}
        </div>
      </div>
      {showAddToPlaylist && (
        <AddToPlaylistModal card={card} onClose={() => setShowAddToPlaylist(false)} />
      )}
    </div>
  );
}
