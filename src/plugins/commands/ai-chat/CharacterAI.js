/**
 * @fileOverview Roleplay-optimized Character AI.
 */
import axios from 'axios';

export default {
  name: "characterai",
  aliases: ["cai", "roleplay"],
  category: "ai-chat",
  description: "Chat with an AI optimized for specific character personas.",
  usage: "cai <persona> | <message>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const input = args.join(' ').split('|');
    const persona = input[0]?.trim() || 'A helpful assistant';
    const msg = input[1]?.trim();

    if (!msg) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: cai Naruto | Hello!\n└────────────────`);

    const prompt = `Acting as: ${persona}. User says: ${msg}`;

    const fallbacks = [
      `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/ai?query=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/gpt4?q=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const ans = res.data.data || res.data.result || res.data.ans;
        if (ans) {
          return ctx.reply(`┌──⌈ 🎭 ${persona.toUpperCase()} ⌋\n┃\n┃ ${ans}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
        }
      } catch (e) { continue; }
    }
    ctx.reply("Character is speechless.");
  }
};
