/**
 * @fileOverview Comprehensive text-based RPG Profile.
 */
export default {
  name: "profile",
  aliases: ["me", "mystats"],
  category: "rpg-levelling",
  description: "View your complete RPG and financial profile.",
  usage: "profile [tag]",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const userId = target.split('@')[0];
    const rpg = await ctx.bot.db.get('rpg_stats', userId) || { xp: 0 };
    const eco = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0 };
    const role = await ctx.bot.managers.roles.getRole(target);

    const level = Math.floor(Math.sqrt(rpg.xp / 100));
    const titles = ['Novice', 'Rookie', 'Veteran', 'Elite', 'Master', 'Grandmaster', 'Legend'];
    const title = titles[Math.min(titles.length - 1, Math.floor(level / 10))];

    const output = `┌──⌈ 👤 USER PROFILE ⌋
┃ Identity: @${userId}
┃ Role: ${title.toUpperCase()}
┃ 
├─ Level: ${level}
├─ Exp: ${rpg.xp.toLocaleString()} XP
┃ 
├─ Wallet: $${eco.wallet.toLocaleString()}
├─ Bank: $${eco.bank.toLocaleString()}
┃ 
├─ Perms: ${role >= 9 ? 'OWNER' : role >= 8 ? 'SUDO' : 'USER'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
