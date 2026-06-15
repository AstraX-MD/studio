/**
 * @fileOverview Alive command with WolfBot Box Styling.
 */
export default {
  name: "alive",
  category: "utility",
  description: "Check if the bot is active.",
  usage: "!alive",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const status = `┌──⌈ ASTRAX STATUS ⌋
┃ Mode: Online
┃ System: Stable
┃ Version: 2.4.0
┃ Status: Active
└────────────────`;
    await ctx.reply(status);
  }
};