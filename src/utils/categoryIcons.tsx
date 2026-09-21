import {
  Utensils, Bus, ShoppingBag, Film, Zap, Heart, DollarSign, Laptop,
  TrendingUp, Wallet, CreditCard, Gift, Home, Book, Music, Tag,
  type LucideIcon,
} from 'lucide-react';

/**
 * Categories store their icon as one of these short keys (chosen from a dropdown
 * in the Categories page). This maps each key to the actual glyph to render.
 * Anything not in this map (e.g. an emoji seeded by default categories) is
 * rendered as plain text, which already works fine for emoji.
 */
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  bus: Bus,
  'shopping-bag': ShoppingBag,
  film: Film,
  zap: Zap,
  heart: Heart,
  'dollar-sign': DollarSign,
  laptop: Laptop,
  'trending-up': TrendingUp,
  wallet: Wallet,
  'credit-card': CreditCard,
  gift: Gift,
  home: Home,
  book: Book,
  music: Music,
};

export const iconOptions = Object.keys(CATEGORY_ICON_MAP);

/** Renders a category's icon whether it's a known icon key or a raw emoji string. */
export function CategoryIcon({ icon, size = 18, className }: { icon: string; size?: number; className?: string }) {
  const Icon = CATEGORY_ICON_MAP[icon];
  if (Icon) return <Icon size={size} className={className} />;
  if (icon && icon.trim()) return <span style={{ fontSize: size }} className={className}>{icon}</span>;
  return <Tag size={size} className={className} />;
}
