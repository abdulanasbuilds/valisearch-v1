/**
 * Utility for sanitizing user inputs to prevent XSS and other injection attacks.
 */

export const sanitizeIdea = (text: string): string => {
  if (!text) return '';
  
  return text
    .trim()
    // Strip HTML tags
    .replace(/<[^>]*>?/gm, '')
    // Remove script tags and their content
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, '')
    // Limit length to 2000 characters
    .slice(0, 2000);
};

export const sanitizeInput = (text: string, maxLength: number = 500): string => {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/<[^>]*>?/gm, '')
    .slice(0, maxLength);
};
