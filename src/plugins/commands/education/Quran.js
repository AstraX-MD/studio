/**
 * @fileOverview Holy Quran verse lookup.
 */
import axios from 'axios';

export default {
  name: "quran",
  category: "education",
  description: "Read a specific verse from the Holy Quran.",
  usage: "quran <surah_number>:<ayah_number>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args[0];

    try {
      const res = await axios.get(`https://api.alquran.cloud/v1/ayah/${query}/en.asad`);
      const d = res.data.data;

      const output = `┌──⌈ 📖 HOLY QURAN ⌋
┃
┃ Surah: ${d.surah.englishName} (${d.numberInSurah})
┃
┃ "${d.text}"
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Ayah not found.\n└────────────────`);
    }
  }
};
