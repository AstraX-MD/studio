/**
 * @fileOverview Bible verse lookup.
 */
import axios from 'axios';

export default {
  name: "bible",
  category: "education",
  description: "Read a specific verse from the Holy Bible.",
  usage: "bible <book> <chapter>:<verse>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://bible-api.com/${encodeURIComponent(query)}`);
      const d = res.data;

      const output = `┌──⌈ 📖 HOLY BIBLE ⌋
┃
┃ Reference: ${d.reference}
┃
┃ "${d.text.trim()}"
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Verse not found.\n└────────────────`);
    }
  }
};
