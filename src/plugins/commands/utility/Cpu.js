/**
 * @fileOverview CPU Performance Audit.
 */
import os from 'os';

export default {
  name: "cpu",
  category: "utility",
  description: "Check CPU model, cores, and current system load.",
  usage: "cpu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const cpus = os.cpus();
    const load = os.loadavg();

    const output = `┌──⌈ 🧠 CPU AUDIT ⌋
┃ 
┃ Model: ${cpus[0].model}
┃ Cores: ${cpus.length} Threads
┃ Speed: ${cpus[0].speed} MHz
┃ 
├─⊷ Load (1m): ${load[0].toFixed(2)}%
├─⊷ Load (5m): ${load[1].toFixed(2)}%
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
