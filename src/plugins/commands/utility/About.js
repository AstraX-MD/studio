/**
 * @fileOverview About command with WolfBot Box Styling.
 */
export default {
  name: "about",
  category: "utility",
  description: "Bot information and credits.",
  usage: "!about",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const output = `┌──⌈ ABOUT ASTRAX ⌋
┃ Author: AstraLabs
┃ Engine: Baileys v6
┃ Purpose: Automation
┃ Security: Warden Guard
└────────────────`;
    await ctx.reply(output);
  }
};