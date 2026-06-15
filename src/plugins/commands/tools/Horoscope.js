/**
 * @fileOverview Daily Horoscope.
 */
import axios from 'axios';

export default {
  name: "horoscope",
  aliases: ["zodiac"],
  category: "tools",
  description: "Get your daily horoscope based on your zodiac sign.",
  usage: "horoscope <sign>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sign = args[0]?.toLowerCase();
    const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    if (!sign || !validSigns.includes(sign)) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}horoscope <sign>\n┃ Example: ${prefix}horoscope leo\n└────────────────`);
    }

    try {
      const res = await axios.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`);
      const d = res.data;

      const output = `┌──⌈ ♈ HOROSCOPE ⌋
┃ Sign: ${sign.toUpperCase()}
┃ Date: ${d.current_date}
┃ Mood: ${d.mood}
┃ Lucky No: ${d.lucky_number}
┃ Color: ${d.color}
┃ 
┃ ${d.description}
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch horoscope.\n└────────────────`);
    }
  }
};