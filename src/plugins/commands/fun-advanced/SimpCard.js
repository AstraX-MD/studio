/**
 * @fileOverview Professional Simp License.
 */
export default {
  name: "simpcard",
  aliases: ["simplicense"],
  category: "fun-advanced",
  description: "Issue a professional 'Simp License' to a user.",
  usage: "simpcard <tag>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const output = `┌──⌈ 🪪 SIMP LICENSE ⌋
┃ 
┃ HOLDER: @${target.split('@')[0]}
┃ RANK: CERTIFIED SIMP
┃ 
├─⊷ VALID: FOREVER
├─⊷ LOYALTY: 100%
├─⊷ PRIDE: 0%
┃ 
┃ Authorized by AstraX Dept.
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
