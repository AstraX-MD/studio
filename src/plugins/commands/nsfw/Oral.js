/**
 * @fileOverview Random NSFW Oral Scraper.
 */
import axios from 'axios';

export default {
  name: "oral",
  category: "nsfw",
  description: "Get random NSFW oral sex images.",
  usage: "oral",
  cooldown: 15,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    try {
      const res = await axios.get('https://api.agatz.xyz/api/oral');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.data },
        caption: `┌──⌈ 🔞 ORAL ⌋\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content unavailable.");
    }
  }
};
