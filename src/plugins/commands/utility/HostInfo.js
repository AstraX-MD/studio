/**
 * @fileOverview Comprehensive Host & Server telemetry.
 */
import os from 'os';

export default {
  name: "hostinfo",
  aliases: ["host", "server"],
  category: "utility",
  description: "Get detailed information about the bot's hosting environment.",
  usage: "hostinfo",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const platform = os.platform();
    const arch = os.arch();
    const cpuCount = os.cpus().length;
    const uptime = Math.floor(os.uptime());
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);

    const output = `┌──⌈ 🖥️ HOST AUDIT ⌋
┃
┃ Platform: ${platform} (${arch})
┃ CPU Core: ${cpuCount} Virtual Threads
┃ Total RAM: ${totalMem} GB
┃ Free RAM: ${freeMem} GB
┃
├─⊷ Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m
├─⊷ Node: ${process.version}
├─⊷ Region: GLOBAL-AUTO
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};