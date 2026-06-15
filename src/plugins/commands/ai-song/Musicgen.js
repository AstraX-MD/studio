/**
 * @fileOverview Meta MusicGen AI.
 */
import axios from 'axios';

export default {
  name: "musicgen",
  category: "ai-song",
  description: "Generate short background music/loops via Meta AI.",
  usage: "musicgen <style>",
  cooldown: 30,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const style = args.join(' ');
    try {
      await ctx.reply("┌──⌈ 🎸 MUSICGEN ⌋\n┃ Composition in progress...\n└────────────────");
      const res = await axios.get(`https://api.agatz.xyz/api/musicgen?text=${encodeURIComponent(style)}`);
      await ctx.sock.sendMessage(ctx.jid, { audio: { url: res.data.data }, mimetype: 'audio/mp4' });
    } catch (e) { ctx.reply("MusicGen is busy."); }
  }
};
