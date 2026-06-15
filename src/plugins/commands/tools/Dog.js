/**
 * @fileOverview Random dog images.
 */
import axios from 'axios';

export default {
  name: "dog",
  category: "tools",
  description: "Get a random cute dog image.",
  usage: "dog",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://dog.ceo/api/breeds/image/random');
      const url = res.data.message;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url },
        caption: `┌──⌈ 🐶 RANDOM DOG ⌋\n┃ Status: Found Woof!\n└────────────────`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to find a dog.\n└────────────────`);
    }
  }
};