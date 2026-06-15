/**
 * @fileOverview Group marriage simulation system.
 */
export default {
  name: "marry",
  aliases: ["propose", "wedding"],
  category: "fun-advanced",
  description: "Propose marriage to another group member.",
  usage: "marry <tag/reply>",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag your partner to propose!\n└────────────────");
    if (target === ctx.sender) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ You cannot marry yourself.\n└────────────────");

    const output = `┌──⌈ 💍 PROPOSAL ⌋
┃ 
┃ @${ctx.sender.split('@')[0]} has proposed 
┃ to @${target.split('@')[0]}!
┃ 
├─⊷ Status: PENDING...
├─⊷ Type: Group Marriage
┃ 
┃ Do you accept? (Type !accept)
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, target] });
  }
};
