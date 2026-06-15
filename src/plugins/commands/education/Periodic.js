/**
 * @fileOverview Chemical element lookup from the periodic table.
 */
import axios from 'axios';

export default {
  name: "periodic",
  aliases: ["element", "chemistry"],
  category: "education",
  description: "Lookup properties of chemical elements.",
  usage: "periodic <element/symbol>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args[0];

    try {
      const res = await axios.get(`https://periodic-table-api.herokuapp.com/element/name/${query}`);
      const d = res.data;

      const output = `┌──⌈ 🧪 CHEMISTRY ⌋
┃
┃ Element: ${d.name} (${d.symbol})
┃ Number: ${d.atomicNumber}
┃ Mass: ${d.atomicMass}
┃ Group: ${d.groupBlock}
┃ Phase: ${d.standardState}
┃ Discovered: ${d.yearDiscovered}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Element not found.\n└────────────────`);
    }
  }
};
