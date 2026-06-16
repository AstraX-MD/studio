/**
 * @fileOverview Claude Command (Primary Groq Engine).
 */
import { aiAgentProcess } from '../../../ai/flows/ai-agent-flow.js';

export default {
  name: "claude",
  aliases: ["anthropic", "cl"],
  category: "ai-chat",
  description: "Chat with the Claude AI model.",
  usage: "claude <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Talk to me...\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🛡️ CLAUDE ⌋\n┃ Status: Reasoning...\n└────────────────`);

    try {
      const result = await aiAgentProcess({
        message: query,
        history: [],
        commands: [],
        context: {
          sender: ctx.sender,
          pushName: ctx.pushName,
          isGroup: ctx.isGroup
        }
      });

      await ctx.sock.sendMessage(ctx.jid, { text: result.response, edit: key });
    } catch (e) {
      ctx.reply("AI Subsystem busy.");
    }
  }
};
