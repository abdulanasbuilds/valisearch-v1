/**
 * Input sanitization utilities.
 * Strips dangerous content before sending to any API.
 */

const MAX_IDEA_LENGTH = 2000;

/** Remove HTML/script tags, trim, and cap length */
export function sanitizeIdea(raw: string): string {
  let text = raw
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove all HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Cap length
  if (text.length > MAX_IDEA_LENGTH) {
    text = text.slice(0, MAX_IDEA_LENGTH);
  }

  return text;
}

/** Sanitize generic text input */
export function sanitizeText(raw: string, maxLength = 500): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Sanitize email input */
export function sanitizeEmail(raw: string): string {
  return raw.trim().toLowerCase().slice(0, 255);
}
