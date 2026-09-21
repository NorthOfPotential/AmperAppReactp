import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CardTile from "../components/CardTile";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import { cards, categories, getCard } from "../data/cardsData";
import { useAuth } from "../state/AuthContext";
import { usePlaylists } from "../state/PlaylistsContext";

const CONTENT_OPTIONS = ["Resources", "Videos", "Templates", "Comics"];

export default function BrowseCardsPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const { playlists, removeCardFromPlaylist } = usePlaylists();

  const playlist = playlistId ? playlists.find((p) => p.id === playlistId) : undefined;

  const [search, setSearch] = useState("");
  const [categoryValue, setCategoryValue] = useState(0);
  const [modeValue, setModeValue] = useState(0); // 0 = All
  const [coreValue, setCoreValue] = useState(0); // 0 = All, 1 = Core, 2 = Expansion
  const [contentValue, setContentValue] = useState(0);
  const [quickAddCardId, setQuickAddCardId] = useState<string | null>(null);

  const baseCards = useMemo(() => {
    if (playlist) {
      return cards.filter((c) => playlist.cards.includes(c.id));
    }
    if (isGuest) {
      return cards.filter((c) => c.core === "Core");
    }
    return cards;
  }, [playlist, isGuest]);

  const filtered = useMemo(() => {
    return baseCards.filter((card) => {
      if (categoryValue >= 0) {
        const hasCategory = card.cardDetails.some((d) => d.category === categoryValue);
        if (!hasCategory) return false;
        if (modeValue > 0) {
          const hasMode = card.cardDetails.some(
            (d) => d.category === categoryValue && d.mode === modeValue - 1,
          );
          if (!hasMode) return false;
        }
      }
      if (!playlist && !isGuest && coreValue > 0) {
        const wantCore = coreValue === 1 ? "Core" : "Expansion";
        if (card.core !== wantCore) return false;
      }
      if (contentValue === 1 && !card.videoUrl) return false;
      if (contentValue === 2 && card.templateImages.length === 0) return false;
      if (contentValue === 3 && card.comicStripes.length === 0) return false;
      if (search && !card.cardName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [baseCards, categoryValue, modeValue, coreValue, contentValue, search, playlist, isGuest]);

  const modeOptions = categories[categoryValue]?.modes ?? [];
  const quickAddCard = quickAddCardId ? getCard(quickAddCardId) : undefined;

  return (
    <div className="screen">
      <div className="topbar">
        <button
          className="back-btn"
          onClick={() => navigate(playlist ? "/playlists" : "/menu")}
        >
          ‹
        </button>
        <h1>{playlist ? playlist.name : "Browse Cards"}</h1>
      </div>
      <div className="screen-body">
        {playlist?.description && (
          <p style={{ color: "var(--text-muted)", marginTop: -8 }}>{playlist.description}</p>
        )}
        <div className="filters-bar">
          <select
            value={categoryValue}
            onChange={(e) => {
              setCategoryValue(Number(e.target.value));
              setModeValue(0);
            }}
          >
            {categories.map((cat, idx) => (
              <option key={cat.categoryName} value={idx}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <select value={modeValue} onChange={(e) => setModeValue(Number(e.target.value))}>
            <option value={0}>All</option>
            {modeOptions.map((mode, idx) => (
              <option key={mode} value={idx + 1}>
                {mode}
              </option>
            ))}
          </select>
          {!playlist && !isGuest && (
            <select value={coreValue} onChange={(e) => setCoreValue(Number(e.target.value))}>
              <option value={0}>All</option>
              <option value={1}>Core</option>
              <option value={2}>Expansion</option>
            </select>
          )}
          <select value={contentValue} onChange={(e) => setContentValue(Number(e.target.value))}>
            {CONTENT_OPTIONS.map((opt, idx) => (
              <option key={opt} value={idx}>
                {opt}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search Card..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!isGuest && (
            <button
              className="ai-helper-btn"
              type="button"
              title="AI recommendations aren't available in this recreation"
              disabled
            >
              AI helper
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No cards match these filters.</div>
        ) : (
          <div className="cards-grid">
            {filtered.map((card) => (
              <CardTile
                key={card.id}
                card={card}
                onOpen={() => navigate(`/card/${card.id}`)}
                onRemove={
                  playlist && !playlist.trainer
                    ? () => removeCardFromPlaylist(playlist.id, card.id)
                    : undefined
                }
                onQuickAdd={!isGuest && !playlist ? () => setQuickAddCardId(card.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
      {quickAddCard && (
        <AddToPlaylistModal card={quickAddCard} onClose={() => setQuickAddCardId(null)} />
      )}
    </div>
  );
}
