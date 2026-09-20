const PLACEHOLDER_ORIGIN = "http://internal.invalid";

const hasControlCharacter = (value: string): boolean => {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
};

/**
 * Returns `value` only when it is a same-origin path ("/en/login?x=1"),
 * otherwise `fallback`. Rejects absolute URLs, protocol-relative URLs
 * ("//host"), backslash tricks and control characters that browsers strip
 * before resolving a URL ("/\t/host").
 */
export const sanitizeInternalPath = (value: unknown, fallback: string): string => {
  if (typeof value !== "string" || value.length === 0) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || hasControlCharacter(value)) return fallback;

  try {
    const resolved = new URL(value, PLACEHOLDER_ORIGIN);
    return resolved.origin === PLACEHOLDER_ORIGIN ? value : fallback;
  } catch {
    return fallback;
  }
};
