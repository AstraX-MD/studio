/**
 * @fileOverview Random NSFW Ass Scraper.
 */
import axios from 'axios';

export default {
  name: "ass",
  category: "nsfw",
  description: "Get random NSFW ass images.",
  usage: "ass",
  cooldown: 15,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    try {
      const res = await axios.get('https://api.agatz.xyz/api/ass');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.data },
        caption: `┌──⌈ 🔞 ASS ⌋\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content unavailable.");
    }
  }
};
