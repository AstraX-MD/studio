/**
 * @fileOverview Random memes from Reddit.
 */
import axios from 'axios';

export default {
  name: "meme",
  category: "tools",
  description: "Get a random hot meme from Reddit.",
  usage: "meme",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://meme-api.com/gimme');
      const data = res.data;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: data.url },
        caption: `┌──⌈ 😂 RANDOM MEME ⌋\n┃ Title: ${data.title}\n┃ Sub: r/${data.subreddit}\n└────────────────`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch a meme.\n└────────────────`);
    }
  }
};