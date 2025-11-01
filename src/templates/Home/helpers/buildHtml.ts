type Maybe<T> = T | null | undefined;

export function buildParagraphs(value?: Maybe<string>): string[] {
  if (!value) {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  const segments = trimmed
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  return segments.length > 0 ? segments : [trimmed];
}
