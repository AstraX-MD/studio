/**
 * @fileOverview Global Country data lookup.
 */
import axios from 'axios';

export default {
  name: "country",
  aliases: ["nation", "geo"],
  category: "education",
  description: "Get detailed information about any country.",
  usage: "country <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const name = args.join(' ');

    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
      const c = res.data[0];

      const output = `┌──⌈ 🗺️ GEOGRAPHY ⌋
┃
┃ Name: ${c.name.official}
┃ Capital: ${c.capitals?.[0] || 'N/A'}
┃ Continent: ${c.continents[0]}
┃ Population: ${c.population.toLocaleString()}
┃ Currency: ${Object.keys(c.currencies)[0]}
┃ Timezone: ${c.timezones[0]}
┃ Area: ${c.area.toLocaleString()} km²
┃
└────────────────
  © ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: c.flags.png },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Country not found.\n└────────────────`);
    }
  }
};
