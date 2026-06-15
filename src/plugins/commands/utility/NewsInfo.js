/**
 * @fileOverview News command with WolfBot Box Styling.
 */
export default {
  name: "news",
  category: "utility",
  description: "Get latest world news (Mock).",
  usage: "!news",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const output = `┌──⌈ LATEST NEWS ⌋
┃ 1. Tech: AstraX v2.4 Released
┃ 2. World: AI Advancements
┃ 3. Crypto: Market Updates
┃ 4. Science: Space Exploration
└────────────────`;
    await ctx.reply(output);
  }
};