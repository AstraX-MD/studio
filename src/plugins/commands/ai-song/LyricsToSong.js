/**
 * @fileOverview AI Vocal Song Engine (Lyrics to Audio).
 */
import axios from 'axios';

export default {
  name: "lyricstosong",
  aliases: ["sing", "vocalize"],
  category: "ai-song",
  description: "Turn your lyrics into a full vocalized AI song.",
  usage: "sing <lyrics>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const lyrics = args.join(' ');
    if (!lyrics) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Provide lyrics for the AI to sing.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🎙️ VOCALIZER ⌋\n┃ Status: Tuning AI Voice...\n┃ Process: Vocal Rendering\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/vocalize?text=${encodeURIComponent(lyrics)}`,
      `https://api.vytmp3.com/sing?lyrics=${encodeURIComponent(lyrics)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const audio = res.data.data || res.data.url;
        if (audio) {
          await ctx.sock.sendMessage(ctx.jid, { 
            audio: { url: audio },
            mimetype: 'audio/mp4',
            caption: `┌──⌈ 🎼 AI VOCALS ⌋\n┃ Status: Rendered\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
          return await ctx.sock.sendMessage(ctx.jid, { delete: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Vocal unit busy.");
  }
};
