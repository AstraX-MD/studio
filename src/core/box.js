export const box = {
  info: async (msg) => `┌──⌈ ℹ️ INFO ⌋\n┃\n┃ ${msg}\n┃\n└────────────────`,
  error: async (msg) => `┌──⌈ ⚠️ ERROR ⌋\n┃\n┃ ${msg}\n┃\n└────────────────`,
  success: async (msg) => `┌──⌈ ✅ SUCCESS ⌋\n┃\n┃ ${msg}\n┃\n└────────────────`
};