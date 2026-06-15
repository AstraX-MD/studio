/**
 * @fileOverview System Statistics command.
 */
import os from 'os';

export default {
  name: "stats",
  category: "utility",
  description: "View system health and bot telemetry.",
  usage: "!stats",
  cooldown: 10,
  permissions: 1, // USER
  execute: async (ctx) => {
    const mem = process.memoryUsage();
    const freeMem = os.freemem() / 1024 / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024 / 1024;
    
    let stats = `*SYSTEM TELEMETRY* 📊\n\n`;
    stats += `> 🧠 *RAM:* ${(mem.rss / 1024 / 1024).toFixed(2)} MB\n`;
    stats += `> 🖥️ *OS Memory:* ${freeMem.toFixed(2)}GB / ${totalMem.toFixed(2)}GB\n`;
    stats += `> 📈 *Load Avg:* ${os.loadavg().map(l => l.toFixed(2)).join(', ')}\n`;
    stats += `> 🛠️ *Database:* ${ctx.bot.db.activeProviderName.toUpperCase()}\n`;
    stats += `> 🖇️ *Active Plugins:* ${ctx.bot.commands.size}\n`;
    stats += `> 👥 *Total Users:* Cached\n\n`;
    stats += `_All systems operating within optimal parameters._`;

    await ctx.reply(stats);
  }
};
