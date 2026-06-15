/**
 * @fileOverview Anthropic Claude-3 AI Chat.
 */
import axios from 'axios';

export default {
  name: "claude",
  aliases: ["anthropic"],
  category: "ai-chat",
  description: "Interact with Claude-3 Opus/Sonnet models.",
  usage: "claude <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Talk to Claude...\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🛡️ CLAUDE ⌋\n┃ Status: Reasoning...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/claude?message=${encodeURIComponent(query)}`,
      `https://api.vytmp3.com/claude?query=${encodeURIComponent(query)}`,
      `https://api.zahwazein.xyz/api/ai/claude?text=${encodeURIComponent(query)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const ans = res.data.result || res.data.data;
        if (ans) {
          return await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ 🛡️ CLAUDE ⌋\n┃\n┃ ${ans}\n┃\n└─ 🌌 ${botName.toUpperCase()}`, edit: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Claude is sleeping.\n└────────────────");
  }
};
