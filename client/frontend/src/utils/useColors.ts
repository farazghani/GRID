// Predefined vibrant color palette for users
const COLOR_PALETTE = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#06B6D4', // cyan
  '#6366F1', // indigo
  '#84CC16', // lime
  '#D946EF', // fuchsia
  '#EAB308', // yellow
  '#22C55E', // green
  '#A855F7', // purple
  '#F43F5E', // rose
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return Math.abs(hash);
}

export function getUserColor(userId: string | null): string {
  if (!userId) return '#E5E7EB'; 
  
  const hash = hashString(userId);
  const colorIndex = hash % COLOR_PALETTE.length;
  
  return COLOR_PALETTE[colorIndex];
}

export function getUserColorLight(userId: string | null): string {
  if (!userId) return '#D1D5DB';
  
  const baseColor = getUserColor(userId);
  return baseColor + '20'; 
}