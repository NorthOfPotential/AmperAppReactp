export type Core = "Core" | "Expansion";

export type ModesOfDesign =
  | "Facilitation"
  | "Understand"
  | "Observe"
  | "Define"
  | "Ideate"
  | "Prototype"
  | "Test"
  | "Realise";

export interface CardDetail {
  category: number;
  mode: number;
}

export interface Card {
  id: string;
  cardName: string;
  core: Core;
  modesOfDesign: ModesOfDesign;
  cardDetails: CardDetail[];
  frontImage: string | null;
  backImage: string | null;
  arIconImage: string | null;
  videoUrl: string;
  frontText: string;
  backText: string;
  templateImages: string[];
  templatesUrl: string[];
  comicStripes: string[];
  swapCardId: string | null;
}

export interface Category {
  categoryName: string;
  modes: string[];
}

export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  cards: string[];
  favorite: boolean;
  trainer?: boolean;
}
