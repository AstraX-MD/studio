/**
 * @fileOverview Runtime command to show bot uptime.
 */

export default {
  name: "runtime",
  aliases: ["uptime"],
  category: "utility",
  description: "Check how long the bot has been running.",
  usage: "!runtime",
  cooldown: 5,
  permissions: 1, // USER
  execute: async (ctx) => {
    const seconds = process.uptime();
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const uptime = `${d}d ${h}h ${m}m ${s}s`;
    await ctx.reply(`*AstraX Uptime Monitor* ⏱️\n\n> 𐂂 Live for: ${uptime}\n> 𐂂 Node Instance: Global-7X`);
  }
};
