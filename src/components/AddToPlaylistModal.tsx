import { FormEvent, useState } from "react";
import { usePlaylists } from "../state/PlaylistsContext";
import type { Card } from "../data/types";

interface Props {
  card: Card;
  onClose: () => void;
}

export default function AddToPlaylistModal({ card, onClose }: Props) {
  const { playlists, createPlaylist, addCardToPlaylist } = usePlaylists();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name.trim(), description.trim());
    setName("");
    setDescription("");
    setCreating(false);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add “{card.cardName}” to a mixtape</h3>
        {playlists.length === 0 && !creating && (
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            You don't have any mixtapes yet.
          </p>
        )}
        <div className="playlist-list">
          {playlists.map((p) => (
            <div key={p.id} className="playlist-row">
              <div className="info">
                <strong>{p.name}</strong>
                <span>{p.cards.length} cards</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  addCardToPlaylist(p.id, card.id);
                  onClose();
                }}
                disabled={p.cards.includes(card.id)}
              >
                {p.cards.includes(card.id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>
        {creating ? (
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="field">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="field">
              <label>Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit">
                Create
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setCreating(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button className="btn btn-secondary" onClick={() => setCreating(true)}>
            + New mixtape
          </button>
        )}
        <button className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
