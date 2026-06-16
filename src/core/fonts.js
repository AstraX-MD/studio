export const fonts = {
  italic: (text) => `_${text}_`,
  bold: (text) => `*${text}*`,
  mono: (text) => `\`\`\`${text}\`\`\``,
  ghost: (text) => text // Placeholder for future font logic
};