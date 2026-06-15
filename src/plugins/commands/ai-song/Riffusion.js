/**
 * @fileOverview Riffusion AI Real-time Melody Generator.
 */
import axios from 'axios';

export default {
  name: "riffusion",
  aliases: ["beat", "melody"],
  category: "ai-song",
  description: "Generate unique melodies and beats from text.",
  usage: "riffusion <style>",
  cooldown: 30,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const style = args.join(' ');

    const { key } = await ctx.reply(`┌──⌈ 🎸 RIFFUSION ⌋\n┃ Status: Visualizing Sound...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/riffusion?text=${encodeURIComponent(style)}`,
      `https://api.dlow.xyz/api/riffusion?q=${encodeURIComponent(style)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const audio = res.data.data || res.data.result;
        if (audio) {
          await ctx.sock.sendMessage(ctx.jid, { 
            audio: { url: audio },
            mimetype: 'audio/mp4',
            caption: `┌──⌈ 🎶 RIFF GEN ⌋\n┃ Style: ${style}\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
          return await ctx.sock.sendMessage(ctx.jid, { delete: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Beat machine failed.");
  }
};
