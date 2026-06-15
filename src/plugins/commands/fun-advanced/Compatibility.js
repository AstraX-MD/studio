/**
 * @fileOverview Deep relationship compatibility analysis.
 */
export default {
  name: "compat",
  aliases: ["match", "lovecalc"],
  category: "fun-advanced",
  description: "Deep compatibility audit between two users.",
  usage: "compat <tag1> <tag2>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mentions = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length < 2) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag two users to audit.\n└────────────────");

    const percent = Math.floor(Math.random() * 101);
    const levels = ['TOXIC', 'STABLE', 'PASSIONATE', 'DESTRUCTIVE', 'DIVINE'];
    const level = percent > 90 ? levels[4] : percent > 70 ? levels[2] : percent > 40 ? levels[1] : percent > 20 ? levels[3] : levels[0];

    const output = `┌──⌈ 🧪 COMPATIBILITY ⌋
┃ 
┃ USER A: @${mentions[0].split('@')[0]}
┃ USER B: @${mentions[1].split('@')[0]}
┃ 
├─⊷ Match: ${percent}%
├─⊷ Level: ${level}
├─⊷ Advice: ${percent > 70 ? 'Marry now!' : 'Run away!'}
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions });
  }
};
