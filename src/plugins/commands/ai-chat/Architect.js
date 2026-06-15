/**
 * @fileOverview Specialized AI for Technical System Architecture.
 */
import axios from 'axios';

export default {
  name: "architect",
  aliases: ["systems", "design"],
  category: "ai-chat",
  description: "AI node specialized in software design and system architecture.",
  usage: "architect <problem/request>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Describe your system requirement.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🏗️ ARCHITECT ⌋\n┃ Status: Blueprinting...\n┃ Mode: High-Reliability\n└────────────────`);

    const prompt = `Act as a Senior System Architect. Provide a technical design for: ${query}. Focus on scalability, security, and clean code.`;

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(prompt)}`);
      const ans = res.data.data;
      
      const output = `┌──⌈ 📐 SYSTEM DESIGN ⌋
┃
┃ ${ans}
┃
└────────────────
  © ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Architect node busy.");
    }
  }
};
