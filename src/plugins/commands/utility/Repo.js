/**
 * @fileOverview Repo command with WolfBot Box Styling.
 */
export default {
  name: "repo",
  aliases: ["script", "source"],
  category: "utility",
  description: "Show the official bot repository.",
  usage: "!repo",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const output = `┌──⌈ REPOSITORY ⌋
┃ Name: AstraX Enterprise
┃ Fork: github.com/astrax/core
┃ License: MIT
┃ Version: 2.4.0
└────────────────`;
    await ctx.reply(output);
  }
};