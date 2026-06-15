/**
 * @fileOverview Platform command with WolfBot Box Styling.
 */
import os from 'os';

export default {
  name: "platform",
  category: "utility",
  description: "Show host platform details.",
  usage: "!platform",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const output = `┌──⌈ HOST DETAILS ⌋
┃ OS: ${os.platform()}
┃ CPU: ${os.arch()}
┃ Release: ${os.release()}
┃ RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB
└────────────────`;
    await ctx.reply(output);
  }
};