/**
 * @fileOverview Call the AstraX Autonomous AI Agent.
 */
import { aiAgentProcess } from '../../../ai/flows/ai-agent-flow.js';

export default {
  name: "agent",
  aliases: ["astra", "bot"],
  category: "ai-chat",
  description: "Interact with the high-performance AstraX AI Agent.",
  usage: "agent <message>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ What do you want to ask the agent?\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🧠 AGENT ⌋\n┃ Status: Reasoning...\n┃ Route: Swarm-Fallback\n└────────────────`);

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

      const output = `┌──⌈ 🌌 ASTRA AGENT ⌋
┃
┃ ${result.response}
┃
└─ 🌌 ASTRAX ENTERPRISE`;

      await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Cognitive failure. Try again.");
    }
  }
};
