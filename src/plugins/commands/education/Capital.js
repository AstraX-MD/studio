/**
 * @fileOverview Capital city lookup.
 */
import axios from 'axios';

export default {
  name: "capital",
  category: "education",
  description: "Find the capital city of any country.",
  usage: "capital <country>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const name = args.join(' ');

    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      const c = res.data[0];

      const output = `┌──⌈ 🏙️ CAPITAL CITY ⌋
┃
┃ Country: ${c.name.common}
┃ Capital: ${c.capitals[0]}
┃ Status: RETRIEVED
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Country not found.\n└────────────────`);
    }
  }
};
