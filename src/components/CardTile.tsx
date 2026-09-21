import type { Card } from "../data/types";

interface Props {
  card: Card;
  onOpen: () => void;
  onRemove?: () => void;
  onQuickAdd?: () => void;
}

export default function CardTile({ card, onOpen, onRemove, onQuickAdd }: Props) {
  return (
    <div className="card-tile" onClick={onOpen}>
      {onRemove ? (
        <button
          className="remove-btn"
          title="Remove from mixtape"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </button>
      ) : (
        onQuickAdd && (
          <button
            className="quick-add-btn"
            title="Add to mixtape"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
          >
            +
          </button>
        )
      )}
      {card.frontImage && <img src={card.frontImage} alt={card.cardName} loading="lazy" />}
      <div className="card-tile-name">{card.cardName}</div>
    </div>
  );
}
