/**
 * @fileOverview Random Blowjob content.
 */
import axios from 'axios';

export default {
  name: "blowjob",
  aliases: ["bj"],
  category: "nsfw",
  description: "Get random NSFW blowjob content.",
  usage: "bj",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/blowjob');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 🔞 BLOWJOB ⌋\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Scraper failed.");
    }
  }
};
