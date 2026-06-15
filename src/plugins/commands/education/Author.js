/**
 * @fileOverview Author information lookup.
 */
import axios from 'axios';

export default {
  name: "author",
  category: "education",
  description: "Get information about famous authors and their works.",
  usage: "author <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const name = args.join(' ');

    try {
      const res = await axios.get(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(name)}`);
      const a = res.data.docs[0];

      const output = `┌──⌈ ✍️ AUTHOR INFO ⌋
┃
┃ Name: ${a.name}
┃ Top Work: ${a.top_work}
┃ Subjects: ${a.top_subjects?.slice(0, 3).join(', ')}
┃ Works: ${a.work_count}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Author not found.\n└────────────────`);
    }
  }
};
