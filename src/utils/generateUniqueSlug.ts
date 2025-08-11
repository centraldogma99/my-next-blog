import { generateSlug } from "./generateSlug";

export const generateUniqueSlug = (text: string, existingSlugs: Map<string, number>): string => {
  const baseId = generateSlug(text);
  const count = existingSlugs.get(baseId) || 0;
  existingSlugs.set(baseId, count + 1);
  
  return count === 0 ? baseId : `${baseId}-${count}`;
};

export const extractHeadingsWithIds = (content: string): Array<{ id: string; text: string; level: number }> => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];
  const idCounts = new Map<string, number>();
  
  return matches.map((match) => {
    const level = match[1].length;
    const text = match[2];
    const id = generateUniqueSlug(text, idCounts);
    
    return { id, text, level };
  });
};