/**
 * @fileOverview Random NSFW Milf Scraper.
 */
import axios from 'axios';

export default {
  name: "milf",
  category: "nsfw",
  description: "Get random NSFW milf images.",
  usage: "milf",
  cooldown: 15,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    try {
      const res = await axios.get('https://api.agatz.xyz/api/milf');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.data },
        caption: `┌──⌈ 🔞 MILF ⌋\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content unavailable.");
    }
  }
};
