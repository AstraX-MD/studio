/**
 * @fileOverview AI Song Generator (Suno Engine).
 */
import axios from 'axios';

export default {
  name: "suno",
  aliases: ["gensong", "aimusic"],
  category: "ai-song",
  description: "Generate a full AI song from a text description.",
  usage: "suno <song description>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    if (!prompt) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Describe the song (Genre/Lyrics/Mood).\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🎵 SYNTHESIZING ⌋\n┃ Prompt: ${prompt.substring(0, 20)}...\n┃ Status: Vocal Rendering...\n└────────────────`);

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/suno?text=${encodeURIComponent(prompt)}`);
      const audio = res.data.data.audio_url || res.data.data.link;

      await ctx.sock.sendMessage(ctx.jid, { 
        audio: { url: audio },
        mimetype: 'audio/mp4',
        ptt: false,
        caption: `┌──⌈ 🎼 AI SONG ⌋\n┃ Title: ${res.data.data.title || 'Generated'}\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Song synthesis failed. Busy servers.\n└────────────────");
    }
  }
};
