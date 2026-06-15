/**
 * @fileOverview Time command with WolfBot Box Styling.
 */
export default {
  name: "time",
  category: "utility",
  description: "Check current server time.",
  usage: "!time",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    
    const output = `┌──⌈ WORLD CLOCK ⌋
┃ Date: ${dateString}
┃ Time: ${timeString}
┃ Zone: UTC
└────────────────`;
    await ctx.reply(output);
  }
};