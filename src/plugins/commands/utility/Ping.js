/**
 * @fileOverview Ping command with WolfBot Box Styling.
 */
export default {
  name: "ping",
  aliases: ["p", "latency"],
  category: "utility",
  description: "Check bot latency.",
  usage: "!ping",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const start = Date.now();
    const { key } = await ctx.reply(`┌──⌈ PINGING ⌋
┃ Status: Calculating...
└───────────────`);
    const end = Date.now();
    
    const responseTime = end - start;
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    await ctx.sock.sendMessage(ctx.jid, {
      text: `┌──⌈ ASTRAX ENGINE ⌋
┃ Latency: ${responseTime}ms
┃ RAM Usage: ${ram}MB
┃ Status: Optimized
└────────────────`,
      edit: key
    });
  }
};