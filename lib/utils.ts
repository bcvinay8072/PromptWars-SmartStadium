/**
 * @module lib/utils
 * Shared utility functions for Nexus26.
 */

/**
 * Sanitizes user input to prevent XSS attacks.
 * Strips HTML tags, JavaScript protocols, event handlers, and data URIs.
 * @param {string} input - Raw user input string
 * @returns {string} Sanitized string safe for rendering and API calls
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .substring(0, 1000);
};
