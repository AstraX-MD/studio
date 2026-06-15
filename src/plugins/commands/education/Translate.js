/**
 * @fileOverview Universal Language Translator with 10+ engine fallbacks.
 */
import axios from 'axios';

export default {
  name: "translate",
  aliases: ["tr", "interpret"],
  category: "education",
  description: "Translate text between 100+ languages instantly.",
  usage: "translate <lang_code> <text>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    let lang = args[0]?.length === 2 ? args[0] : 'en';
    let text = args[0]?.length === 2 ? args.slice(1).join(' ') : args.join(' ');
    
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
    if (quoted && !text) text = quoted;

    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}tr <lang> <text>\n┃ Example: ${prefix}tr fr Hello\n└────────────────`);

    const fallbacks = [
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,
      `https://api.agatz.xyz/api/translate?text=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.vytmp3.com/translate?text=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.dlow.xyz/api/tr?q=${encodeURIComponent(text)}&lang=${lang}`,
      `https://api.xyter.com/tr?q=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.zahwazein.xyz/api/tr?q=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.miftah.xyz/api/tr?q=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.caliph.biz.id/api/tr?q=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.paxsenix.biz.id/api/tr?q=${encodeURIComponent(text)}&to=${lang}`,
      `https://api.yanzbotz.my.id/api/tr?q=${encodeURIComponent(text)}&to=${lang}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const translated = Array.isArray(res.data) ? res.data[0][0][0] : (res.data.result || res.data.data);

        if (translated) {
          const output = `┌──⌈ 🌍 TRANSLATOR ⌋
┃
┃ Target: ${lang.toUpperCase()}
┃ Input: ${text.substring(0, 100)}...
┃
┃ Output: 
┃ ${translated}
┃
└────────────────
  © ${botName.toUpperCase()}`;
          return ctx.reply(output);
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Translation service busy.\n└────────────────`);
  }
};
