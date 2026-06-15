/**
 * @fileOverview System Stats with WolfBot Box Styling.
 */
import os from 'os';

export default {
  name: "stats",
  category: "utility",
  description: "View system health.",
  usage: "!stats",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const mem = process.memoryUsage();
    const ramUsed = (mem.rss / 1024 / 1024).toFixed(1);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    
    let stats = `┌──⌈ TELEMETRY ⌋
┃ RAM: ${ramUsed}MB / ${totalMem}GB
┃ DB: ${ctx.bot.db.activeProviderName.toUpperCase()}
┃ CPU Load: ${os.loadavg()[0].toFixed(2)}
┃ Plugins: ${ctx.bot.commands.size} Active
└────────────────`;

    await ctx.reply(stats);
  }
};