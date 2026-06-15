/**
 * @fileOverview 'On This Day' historical events.
 */
import axios from 'axios';

export default {
  name: "history",
  aliases: ["todayhistory", "onthisday"],
  category: "education",
  description: "Learn what happened on this day in history.",
  usage: "history",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    try {
      const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
      const event = res.data.events[Math.floor(Math.random() * res.data.events.length)];

      const output = `┌──⌈ ⏳ ON THIS DAY ⌋
┃
┃ Year: ${event.year}
┃ Event: ${event.text}
┃
├─⊷ Discovering the past...
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ History archives busy.\n└────────────────`);
    }
  }
};
