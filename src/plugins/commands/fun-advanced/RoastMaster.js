/**
 * @fileOverview Extreme multi-line insults.
 */
export default {
  name: "extremeroast",
  aliases: ["vavage"],
  category: "fun-advanced",
  description: "Generate a multi-layered high-tier insult.",
  usage: "extremeroast <tag>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mention = target ? `@${target.split('@')[0]} ` : "Everyone here ";
    const roasts = [
      "Your brain is so small that a single thought would give you a stroke.",
      "I'd agree with you but then we'd both be wrong.",
      "You're proof that even mistakes can be expensive to keep alive."
    ];

    const output = `┌──⌈ 💢 EXTREME ROAST ⌋
┃ 
┃ ${mention}...
┃ 
┃ "${roasts[Math.floor(Math.random() * roasts.length)]}"
┃ 
├─⊷ Severity: CRITICAL
├─⊷ Burn Level: MAX
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: target ? [target] : [] });
  }
};
