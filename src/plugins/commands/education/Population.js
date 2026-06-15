/**
 * @fileOverview Population statistics lookup.
 */
import axios from 'axios';

export default {
  name: "population",
  category: "education",
  description: "Get population data for any country.",
  usage: "population <country>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const name = args.join(' ');

    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      const c = res.data[0];

      const output = `┌──⌈ 👥 POPULATION ⌋
┃
┃ Country: ${c.name.common}
┃ Count: ${c.population.toLocaleString()}
┃ Density: ${ (c.population / c.area).toFixed(2) } per km²
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Country not found.\n└────────────────`);
    }
  }
};
