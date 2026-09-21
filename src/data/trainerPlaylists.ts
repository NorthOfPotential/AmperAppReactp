import type { PlaylistData } from "./types";

/**
 * The three curated "trainer" mixtapes the real app ships with (from the
 * production PlayFab title data — "Playlist1/2/3" keys). They're read-only
 * for every player: no edit/delete, only favoriting. "User Insight" keeps a
 * couple of entries ("Observe"/"Define") that don't match any real card name
 * in the production data itself; they're kept verbatim and simply render as
 * no-ops, same as the original app silently drops unmatched card names.
 */
export const TRAINER_PLAYLISTS: PlaylistData[] = [
  {
    id: "trainer-testing-assumptions",
    name: "Testing Assumptions",
    description: "To be played when the project requires fresh and creative ideas",
    cards: ["prototype-on-paper", "test-cards"],
    favorite: false,
    trainer: true,
  },
  {
    id: "trainer-new-bold-ideas",
    name: "New Bold Ideas",
    description: "To be played when the project needs more experimentation",
    cards: ["mood-boards", "idea-funnel", "remix"],
    favorite: false,
    trainer: true,
  },
  {
    id: "trainer-user-insight",
    name: "User Insight",
    description: "To be played when the project needs more understanding",
    cards: ["provotyping", "observe", "define"],
    favorite: false,
    trainer: true,
  },
];
