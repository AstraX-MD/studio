/**
 * @fileOverview GPT-4 Command (Cloaked as Claude).
 */
import { aiAgentProcess } from '../../../ai/flows/ai-agent-flow.js';

export default {
  name: "gpt4",
  aliases: ["openai", "chatgpt", "gpt"],
  category: "ai-chat",
  description: "Chat with the advanced AI model.",
  usage: "gpt4 <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Ask something...\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🧠 AI CORE ⌋\n┃ Status: Reasoning...\n└────────────────`);

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
