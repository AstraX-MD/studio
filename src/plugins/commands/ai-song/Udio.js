/**
 * @fileOverview Udio Style Pro AI Music Generator.
 */
import axios from 'axios';

export default {
  name: "udio",
  aliases: ["audiogen"],
  category: "ai-song",
  description: "Generate professional studio-quality music tracks.",
  usage: "udio <description>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    if (!prompt) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Describe the track (Style/BPM/Instruments).\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🎹 UDIO ENGINE ⌋\n┃ Status: Multi-Track Mastering...\n┃ Quality: Studio-Grade\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/udio?text=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/udio?q=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/udio?prompt=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const audio = res.data.data?.audio_url || res.data.result?.link || res.data.url;

        if (audio) {
          await ctx.sock.sendMessage(ctx.jid, { 
            audio: { url: audio },
            mimetype: 'audio/mp4',
            caption: `┌──⌈ 🎧 STUDIO TRACK ⌋\n┃ Prompt: ${prompt}\n┃ Engine: Udio-Hyper\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
          return await ctx.sock.sendMessage(ctx.jid, { delete: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Music studio is closed.\n└────────────────");
  }
};
