/**
 * @fileOverview Create a text paste online.
 */
import axios from 'axios';

export default {
  name: "paste",
  aliases: ["publish"],
  category: "tools",
  description: "Publish your text to an online paste service.",
  usage: "paste <content>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const text = args.join(' ');
    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}paste <text>\n└────────────────`);

    try {
      const res = await axios.post('https://hastebin.com/documents', text);
      const url = `https://hastebin.com/${res.data.key}`;
      
      const output = `┌──⌈ 📝 HASTEBIN ⌋
┃ Status: Published
┃ Link: ${url}
┃ Expiry: 30 Days
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to publish paste.\n└────────────────`);
    }
  }
};