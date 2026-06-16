/**
 * @fileOverview Deep RAM/Memory Consumption Audit.
 */
import os from 'os';

export default {
  name: "ram",
  aliases: ["memory", "mem"],
  category: "utility",
  description: "Audit memory consumption and available system RAM.",
  usage: "ram",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mem = process.memoryUsage();
    
    const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(1);
    const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const free = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);

    const output = `┌──⌈ 📊 RAM AUDIT ⌋
┃ 
┃ RSS: ${toMB(mem.rss)} MB
┃ Heap: ${toMB(mem.heapUsed)} / ${toMB(mem.heapTotal)} MB
┃ External: ${toMB(mem.external)} MB
┃ 
├─⊷ System Total: ${total} GB
├─⊷ System Free: ${free} GB
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
