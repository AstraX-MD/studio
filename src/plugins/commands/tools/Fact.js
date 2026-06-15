/**
 * @fileOverview Random useless facts.
 */
import axios from 'axios';

export default {
  name: "fact",
  category: "tools",
  description: "Get a random interesting but useless fact.",
  usage: "fact",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      const output = `┌──⌈ 🧐 DID YOU KNOW? ⌋
┃ 
┃ ${res.data.text}
┃
└─ 🌌 AstraX Enterprise`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch facts.\n└────────────────`);
    }
  }
};