/**
 * @fileOverview Detailed Operating System Audit.
 */
import os from 'os';

export default {
  name: "os",
  category: "utility",
  description: "Display detailed operating system information.",
  usage: "os",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🖥️ OS AUDIT ⌋
┃ 
┃ Type: ${os.type()}
┃ Release: ${os.release()}
┃ Arch: ${os.arch()}
┃ Host: ${os.hostname()}
┃
├─⊷ Platform: ${os.platform()}
├─⊷ Kernel: ${os.version()}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
