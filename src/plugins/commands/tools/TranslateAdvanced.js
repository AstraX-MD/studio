/**
 * @fileOverview Professional multi-language interpretation.
 */
import axios from 'axios';

export default {
  name: "translator",
  aliases: ["interpret"],
  category: "tools",
  description: "Professional interpretation engine with multi-language support.",
  usage: "translator <target_lang> <text>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let lang = args[0]?.length === 2 ? args[0] : 'en';
    let text = args[0]?.length === 2 ? args.slice(1).join(' ') : args.join(' ');

    if (!text) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Usage: !translator fr Hello\n└────────────────");

    try {
      const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
      const result = res.data[0][0][0];

      const output = `┌──⌈ 🌍 INTERPRET ⌋
┃
┃ Input: ${text}
┃ Target: ${lang.toUpperCase()}
┃ 
┃ Output: 
┃ ${result}
┃
└────────────────
  © ${botName.toUpperCase()}`;

      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Translation node busy.");
    }
  }
};
