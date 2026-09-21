import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../state/PlaylistsContext";
import type { PlaylistData } from "../data/types";

export default function PlaylistsPage() {
  const navigate = useNavigate();
  const { playlists, createPlaylist, updatePlaylist, deletePlaylist, toggleFavorite } =
    usePlaylists();
  const [editing, setEditing] = useState<PlaylistData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PlaylistData | null>(null);

  const sorted = [...playlists].sort((a, b) => Number(b.favorite) - Number(a.favorite));

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setShowForm(true);
  }

  function openEdit(p: PlaylistData) {
    setEditing(p);
    setName(p.name);
    setDescription(p.description);
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) {
      updatePlaylist(editing.id, name.trim(), description.trim());
    } else {
      createPlaylist(name.trim(), description.trim());
    }
    setShowForm(false);
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate("/menu")}>
          ‹
        </button>
        <h1>Mixtapes</h1>
        <button className="icon-btn" onClick={openCreate} title="New mixtape">
          +
        </button>
      </div>
      <div className="screen-body">
        {sorted.length === 0 ? (
          <div className="empty-state">
            You haven't created any mixtapes yet.
            <div style={{ marginTop: 14 }}>
              <button className="btn btn-primary" onClick={openCreate}>
                Create your first mixtape
              </button>
            </div>
          </div>
        ) : (
          <div className="playlist-list">
            {sorted.map((p) => (
              <div
                className="playlist-row"
                key={p.id}
                onClick={() => navigate(`/playlists/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="info">
                  <strong>{p.name}</strong>
                  <span>
                    {p.description || "No description"} · {p.cards.length} cards
                  </span>
                </div>
                <div className="row-actions">
                  <button
                    className={`star-btn ${p.favorite ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p.id);
                    }}
                    title="Favorite"
                  >
                    ★
                  </button>
                  {p.trainer ? (
                    <span className="badge" title="Official Amper mixtape">
                      Amper
                    </span>
                  ) : (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(p);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(p);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3>{editing ? "Edit mixtape" : "Create mixtape"}</h3>
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
                {editing ? "Save" : "Create"}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete "{deleteTarget.name}"?</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              This can't be undone.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deletePlaylist(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
