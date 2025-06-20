export function getChapterName(chapter: string | undefined | null): string {
  if (!chapter) return "";
  const parts = chapter.split("-");
  return parts.length > 1 ? parts[1].trim() : chapter.trim();
}