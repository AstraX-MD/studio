/**
 * @fileOverview Scientific Computational Intelligence.
 */
import axios from 'axios';

export default {
  name: "wolfram",
  aliases: ["compute", "science"],
  category: "ai-chat",
  description: "Access computational knowledge and scientific facts via WolframAlpha.",
  usage: "wolfram <query>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Computational query required.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🔬 COMPUTING ⌋\n┃ Querying Alpha Nodes...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/wolframalpha?query=${encodeURIComponent(query)}`,
      `https://api.vytmp3.com/wolfram?q=${encodeURIComponent(query)}`,
      `https://api.dlow.xyz/api/compute?q=${encodeURIComponent(query)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const ans = res.data.data || res.data.result;
        if (ans) {
          const output = `┌──⌈ 🧬 SCIENTIFIC ⌋
┃
┃ Query: ${query}
┃
┃ Result:
┃ ${ans}
┃
└─ 🌌 ${botName.toUpperCase()}`;
          return await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Science desk unreachable.");
  }
};
