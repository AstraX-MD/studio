/**
 * @fileOverview Check remaining subscription days.
 */
export default {
  name: "botdays",
  aliases: ["expiry", "subinfo"],
  category: "sudo",
  description: "Check the remaining deployment subscription time.",
  usage: "botdays",
  permissions: 8,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const deployDate = await ctx.bot.db.get('core', 'deployment_date');
    const expireDays = parseInt(process.env.EXPIRE_DAYS);

    if (!expireDays || !deployDate) {
      return ctx.reply(`┌──⌈ ♾️ LIFETIME ⌋\n┃ Subscription: UNLIMITED\n┃ Status: Permanent\n└─ 🌌 ${botName.toUpperCase()}`);
    }

    const expiryTime = deployDate + (expireDays * 24 * 60 * 60 * 1000);
    const now = Date.now();
    const remaining = expiryTime - now;

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const output = `┌──⌈ ⏳ BOT EXPIRY ⌋
┃
┃ Remaining: ${days} Days, ${hours} Hours
┃ Status: ${days < 3 ? '🔴 CRITICAL' : '✅ ACTIVE'}
┃
├─⊷ Deployment: ${new Date(deployDate).toLocaleDateString()}
├─⊷ Expiration: ${new Date(expiryTime).toLocaleDateString()}
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};