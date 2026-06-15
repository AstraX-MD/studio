/**
 * @fileOverview Group bounty hunter game.
 */
export default {
  name: "setbounty",
  category: "fun-advanced",
  description: "Set a fake bounty on a member's head.",
  usage: "setbounty <tag>",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag the target!\n└────────────────");

    const amount = (Math.floor(Math.random() * 50) + 1) + " MILLION XP";

    const output = `┌──⌈ 🔫 BOUNTY SET ⌋
┃ 
┃ TARGET: @${target.split('@')[0]}
┃ REWARD: ${amount}
┃ 
├─⊷ STATUS: HUNTED
├─⊷ ISSUED BY: @${ctx.sender.split('@')[0]}
┃ 
┃ Go get them!
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target, ctx.sender] });
  }
};
