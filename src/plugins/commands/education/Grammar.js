/**
 * @fileOverview Grammar correction tool.
 */
import axios from 'axios';

export default {
  name: "grammar",
  category: "education",
  description: "Correct grammar mistakes in any sentence.",
  usage: "grammar <sentence>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const text = args.join(' ');

    try {
      // Using a grammar check proxy
      const res = await axios.get(`https://api.textgears.com/grammar?text=${encodeURIComponent(text)}&key=DEMO_KEY`);
      const corrected = res.data.response.corrected || text;

      const output = `┌──⌈ ✍️ GRAMMAR CHECK ⌋
┃
┃ Original: ${text}
┃ Corrected: ${corrected}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Grammar service busy.\n└────────────────`);
    }
  }
};
