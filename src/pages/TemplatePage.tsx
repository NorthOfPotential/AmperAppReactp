import { useNavigate, useParams } from "react-router-dom";
import { getCard } from "../data/cardsData";

export default function TemplatePage() {
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
        <h1>{card.cardName} — Templates</h1>
      </div>
      <div className="screen-body">
        <div className="templates-list">
          {card.templateImages.map((img, idx) => (
            <div className="template-card" key={img}>
              <img src={img} alt={`${card.cardName} template ${idx + 1}`} />
              {card.templatesUrl[idx] && (
                <a
                  className="btn btn-secondary"
                  href={card.templatesUrl[idx]}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open editable template
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
