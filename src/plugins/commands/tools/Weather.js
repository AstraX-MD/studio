/**
 * @fileOverview Real-time weather reporting.
 */
import axios from 'axios';

export default {
  name: "weather",
  category: "tools",
  description: "Check the current weather in any city.",
  usage: "weather <city>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const city = args.join(' ');
    if (!city) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}weather <city>\n└────────────────`);

    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=06af695832a4bc099f0e1d51a660a955`);
      const data = res.data;

      const output = `┌──⌈ ☁️ WEATHER ⌋
┃ City: ${data.name}, ${data.sys.country}
┃ Temp: ${data.main.temp}°C
┃ Condition: ${data.weather[0].main} (${data.weather[0].description})
┃ Humidity: ${data.main.humidity}%
┃ Wind: ${data.wind.speed} m/s
┃ Visibility: ${data.visibility / 1000}km
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ City not found or API unavailable.\n└────────────────`);
    }
  }
};