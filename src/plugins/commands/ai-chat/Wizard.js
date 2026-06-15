/**
 * @fileOverview WizardLM AI Chat.
 */
import axios from 'axios';

export default {
  name: "wizard",
  category: "ai-chat",
  description: "Chat with WizardLM.",
  usage: "wizard <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/wizardlm?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🧙 WIZARD ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Wizard is out of mana."); }
  }
};
