/**
 * @fileOverview URL Shortener with multiple fallbacks.
 */
import axios from 'axios';

export default {
  name: "shorturl",
  aliases: ["shorten", "tinyurl"],
  category: "tools",
  description: "Shorten a long URL using TinyURL.",
  usage: "shorturl <url>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const url = args[0];
    if (!url) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}shorturl <url>\n└────────────────`);

    try {
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      ctx.reply(`┌──⌈ 🔗 SHORTENER ⌋\n┃ Original: ${url}\n┃ Short: ${res.data}\n└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to shorten URL.\n└────────────────`);
    }
  }
};