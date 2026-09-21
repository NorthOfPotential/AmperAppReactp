import cardsJson from "./cards.json";
import categoriesJson from "./categories.json";
import type { Card, Category } from "./types";

export const cards: Card[] = cardsJson as Card[];
export const categories: Category[] = categoriesJson as Category[];

const cardsById = new Map(cards.map((c) => [c.id, c]));

export function getCard(id: string): Card | undefined {
  return cardsById.get(id);
}
