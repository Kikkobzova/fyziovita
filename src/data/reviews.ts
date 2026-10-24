export interface ReviewItem {
  text: string;
  author: string; // napr. "Jana N."
  source: 'Google';
  rating?: number;
}

// Podľa špecifikácie: nikdy nevkladať vymyslené recenzie.
// Pole zostáva prázdne, kým nebudú overené reálne Google recenzie.
export const REVIEWS: ReviewItem[] = [];
