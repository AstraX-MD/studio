/**
 * AstraX - system/fonts.js
 * Standard font formatting fallback.
 */
export const fonts = {
  italic: (text) => `_${text}_`,
  bold: (text) => `*${text}*`,
  mono: (text) => `\`\`\`${text}\`\`\``
};