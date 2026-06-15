/**
 * @fileOverview Astronomy & Planet lookup.
 */
import axios from 'axios';

export default {
  name: "planet",
  aliases: ["space", "astronomy"],
  category: "education",
  description: "Get scientific data about planets in our solar system.",
  usage: "planet <name>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const name = args[0]?.toLowerCase();

    try {
      const res = await axios.get(`https://api.le-systeme-solaire.net/rest/bodies/${name}`);
      const d = res.data;

      const output = `┌──⌈ 🪐 ASTRONOMY ⌋
┃
┃ Body: ${d.englishName}
┃ Gravity: ${d.gravity} m/s²
┃ Density: ${d.density} g/cm³
┃ Mean Radius: ${d.meanRadius} km
┃ Moons: ${d.moons?.length || 0}
┃ Discovery: ${d.discoveryDate || 'Ancient'}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Planet not found.\n└────────────────`);
    }
  }
};
