/**
 * @fileOverview Capture a screenshot of any website.
 */
import axios from 'axios';

export default {
  name: "screenshot",
  aliases: ["ss", "webshot"],
  category: "tools",
  description: "Capture a full-page screenshot of a website.",
  usage: "screenshot <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let url = args[0];
    if (!url) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}screenshot <url>\n└────────────────`);

    if (!url.startsWith('http')) url = 'https://' + url;

    try {
      const ssUrl = `https://api.screenshotmachine.com/?key=7d6f5a&url=${encodeURIComponent(url)}&dimension=1024x768`;
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: ssUrl },
        caption: `┌──⌈ 📸 SCREENSHOT ⌋\n┃ Target: ${url}\n┃ Status: Captured\n└────────────────`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to capture screenshot.\n┃ Reason: Service Timeout\n└────────────────`);
    }
  }
};