/**
 * @fileOverview Latency check with dynamic name resolution.
 */
export default {
  name: "ping",
  aliases: ["p", "latency"],
  category: "utility",
  description: "Check bot latency.",
  usage: "ping",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const start = Date.now();
    const { key } = await ctx.reply(`┌──⌈ PINGING ⌋\n┃ Status: Calculating...\n└───────────────`);
    const end = Date.now();
    
    const responseTime = end - start;
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    await ctx.sock.sendMessage(ctx.jid, {
      text: `┌──⌈ ${botName.toUpperCase()} ENGINE ⌋
┃ Latency: ${responseTime}ms
┃ RAM Usage: ${ram}MB
┃ Status: Optimized
└────────────────`,
      edit: key
    });
  }
};
