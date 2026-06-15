/**
 * @fileOverview Deep resource audit.
 */
import os from 'os';

export default {
  name: "resources",
  aliases: ["res", "usage"],
  category: "owner",
  description: "Detailed system resource consumption audit.",
  usage: "resources",
  ownerOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const mem = process.memoryUsage();
    const rss = (mem.rss / 1024 / 1024).toFixed(1);
    const heap = (mem.heapUsed / 1024 / 1024).toFixed(1);
    const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const free = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);

    const output = `┌──⌈ 📊 RESOURCE AUDIT ⌋
┃
┃ Node RAM: ${rss} MB
┃ Heap Used: ${heap} MB
┃ System Total: ${total} GB
┃ System Free: ${free} GB
┃
├─⊷ CPU Load: ${os.loadavg()[0].toFixed(2)}
├─⊷ Threads: ${os.cpus().length}
├─⊷ Platform: ${os.platform()}
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
