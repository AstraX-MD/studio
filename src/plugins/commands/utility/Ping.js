/**
 * @fileOverview Ping command to check bot responsiveness.
 */

export default {
  name: "ping",
  aliases: ["p", "latency"],
  category: "utility",
  description: "Check the bot's response time and system latency.",
  usage: "!ping",
  cooldown: 5,
  permissions: 1, // USER
  execute: async (ctx) => {
    const start = Date.now();
    const { key } = await ctx.reply("Calculating latency...");
    const end = Date.now();
    
    const responseTime = end - start;
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

    await ctx.sock.sendMessage(ctx.jid, {
      text: `*AstraX Response Metrics* ⚡\n\n> 𐂂 Latency: ${responseTime}ms\n> 𐂂 RAM Usage: ${ram} MB\n> 𐂂 Status: Optimized`,
      edit: key
    });
  }
};
