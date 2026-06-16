/**
 * @fileOverview AI Song Generator (Suno Engine).
 */
import axios from 'axios';

export default {
  name: "suno",
  aliases: ["gensong", "aimusic"],
  category: "ai-music",
  description: "Generate a full AI song from a text description.",
  usage: "suno <song description>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const prompt = args.join(' ');
    if (!prompt) return ctx.reply("Describe the song first.");

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/suno?text=${encodeURIComponent(prompt)}`);
      const audio = res.data.data.audio_url || res.data.data.link;

      await ctx.sock.sendMessage(ctx.jid, { 
        audio: { url: audio },
        mimetype: 'audio/mp4',
        caption: `┌──⌈ 🎼 AI SONG ⌋\n┃ Title: ${res.data.data.title || 'Generated'}\n└─ AstraX System`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("Song synthesis failed. Busy servers.");
    }
  }
};