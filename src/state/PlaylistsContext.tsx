import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PlaylistData } from "../data/types";
import { TRAINER_PLAYLISTS } from "../data/trainerPlaylists";

type PlaylistsState = {
  playlists: PlaylistData[];
  createPlaylist: (name: string, description: string) => void;
  updatePlaylist: (id: string, name: string, description: string) => void;
  deletePlaylist: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCardToPlaylist: (id: string, cardId: string) => void;
  removeCardFromPlaylist: (id: string, cardId: string) => void;
};

const PlaylistsContext = createContext<PlaylistsState | null>(null);

const STORAGE_KEY = "amper.playlists";

function loadStored(): PlaylistData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlaylistData[];
  } catch {
    // ignore corrupt storage
  }
  return TRAINER_PLAYLISTS;
}

export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<PlaylistData[]>(loadStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const value = useMemo<PlaylistsState>(
    () => ({
      playlists,
      createPlaylist: (name, description) =>
        setPlaylists((prev) => [
          ...prev,
          { id: crypto.randomUUID(), name, description, cards: [], favorite: false },
        ]),
      updatePlaylist: (id, name, description) =>
        setPlaylists((prev) =>
          prev.map((p) => (p.id === id && !p.trainer ? { ...p, name, description } : p)),
        ),
      deletePlaylist: (id) =>
        setPlaylists((prev) => prev.filter((p) => p.id !== id || p.trainer)),
      toggleFavorite: (id) =>
        setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))),
      addCardToPlaylist: (id, cardId) =>
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === id && !p.cards.includes(cardId) ? { ...p, cards: [...p.cards, cardId] } : p,
          ),
        ),
      removeCardFromPlaylist: (id, cardId) =>
        setPlaylists((prev) =>
          prev.map((p) => (p.id === id ? { ...p, cards: p.cards.filter((c) => c !== cardId) } : p)),
        ),
    }),
    [playlists],
  );

  return <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>;
}

export function usePlaylists(): PlaylistsState {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) throw new Error("usePlaylists must be used within a PlaylistsProvider");
  return ctx;
}
