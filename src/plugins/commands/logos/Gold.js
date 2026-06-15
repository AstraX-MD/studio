/**
 * @fileOverview Generate a premium gold style logo.
 */
import axios from 'axios';

export default {
  name: "gold",
  aliases: ["goldlogo"],
  category: "logos",
  description: "Generate a luxury gold style logo.",
  usage: "gold <text>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const text = args.join(' ');

    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}gold <text>\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🎨 LOGO GEN ⌋\n┃ Theme: Gold\n┃ Status: Rendering...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/textpro?theme=gold&text=${encodeURIComponent(text)}`,
      `https://api.vytmp3.com/textpro?theme=gold&text=${encodeURIComponent(text)}`,
      `https://api.xyter.com/textpro?theme=gold&text=${encodeURIComponent(text)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ ✨ GOLD LOGO ⌋\n┃ Text: ${text}\n┃ Status: Generated\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Generation failed. All sources busy.\n└────────────────`);
  }
};