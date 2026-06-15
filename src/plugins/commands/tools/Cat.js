/**
 * @fileOverview Random cat images.
 */
import axios from 'axios';

export default {
  name: "cat",
  category: "tools",
  description: "Get a random cute cat image.",
  usage: "cat",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://api.thecatapi.com/v1/images/search');
      const url = res.data[0].url;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url },
        caption: `┌──⌈ 🐱 RANDOM CAT ⌋\n┃ Status: Found Meow!\n└────────────────`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to find a cat.\n└────────────────`);
    }
  }
};