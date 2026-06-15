/**
 * @fileOverview Get random life advice.
 */
import axios from 'axios';

export default {
  name: "advice",
  category: "tools",
  description: "Get a piece of random life advice.",
  usage: "advice",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://api.adviceslip.com/advice');
      const output = `┌──⌈ 💡 ADVICE ⌋
┃ 
┃ ${res.data.slip.advice}
┃
└─ 🌌 AstraX Enterprise`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch advice.\n└────────────────`);
    }
  }
};