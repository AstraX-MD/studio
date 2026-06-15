/**
 * @fileOverview Google Gemini AI Chat.
 */
import axios from 'axios';

export default {
  name: "gemini",
  aliases: ["googleai", "bard"],
  category: "ai-chat",
  description: "Chat with Google's most powerful AI, Gemini.",
  usage: "gemini <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Query required.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ ♊ GEMINI ⌋\n┃ Status: Querying Google...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/gemini?message=${encodeURIComponent(query)}`,
      `https://api.vytmp3.com/gemini?query=${encodeURIComponent(query)}`,
      `https://api.dlow.xyz/api/gemini?q=${encodeURIComponent(query)}`,
      `https://api.zahwazein.xyz/api/ai/gemini?text=${encodeURIComponent(query)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const ans = res.data.result || res.data.data || res.data.ans;
        if (ans) {
          return await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ ♊ GEMINI ⌋\n┃\n┃ ${ans}\n┃\n└─ 🌌 ${botName.toUpperCase()}`, edit: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Gemini is currently offline.\n└────────────────");
  }
};
