/**
 * @fileOverview Global University search.
 */
import axios from 'axios';

export default {
  name: "university",
  category: "education",
  description: "Search for universities globally.",
  usage: "university <country> <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const country = args[0];
    const name = args.slice(1).join(' ');

    try {
      const res = await axios.get(`http://universities.hipolabs.com/search?country=${country}&name=${name}`);
      const u = res.data[0];

      const output = `┌──⌈ 🎓 UNIVERSITY ⌋
┃
┃ Name: ${u.name}
┃ Country: ${u.country}
┃ Domain: ${u.domains[0]}
┃ Website: ${u.web_pages[0]}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Institution not found.\n└────────────────`);
    }
  }
};
