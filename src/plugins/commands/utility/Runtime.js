/**
 * @fileOverview Runtime command with WolfBot Box Styling.
 */
export default {
  name: "runtime",
  aliases: ["uptime"],
  category: "utility",
  description: "Check bot uptime.",
  usage: "!runtime",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const seconds = process.uptime();
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const uptime = `${h}h ${m}m ${s}s`;
    
    await ctx.reply(`┌──⌈ SYSTEM STATUS ⌋
┃ Status: Active
┃ Uptime: ${uptime}
┃ Platform: Global-Node
└────────────────`);
  }
};