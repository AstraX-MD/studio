/**
 * @fileOverview Random inspirational quotes.
 */
import axios from 'axios';

export default {
  name: "quote",
  category: "tools",
  description: "Get a random inspirational quote.",
  usage: "quote",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://api.quotable.io/random');
      const output = `┌──⌈ 📜 QUOTE ⌋
┃ 
┃ "${res.data.content}"
┃ 
┃ — ${res.data.author}
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch quote.\n└────────────────`);
    }
  }
};