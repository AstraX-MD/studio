/**
 * @fileOverview High-tier Rizz/Pickup lines.
 */
export default {
  name: "rizz",
  aliases: ["smooth"],
  category: "fun-advanced",
  description: "Get a premium high-tier pickup line.",
  usage: "rizz <tag>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mention = target ? `@${target.split('@')[0]}, ` : "";
    const lines = [
      "Are you the sun? Because my world revolves around you.",
      "Are you a black hole? Because you've pulled me in completely.",
      "If I were a keyboard, you'd be my Shift key, because you elevate me."
    ];

    const output = `┌──⌈ 💎 PREMIUM RIZZ ⌋
┃ 
┃ ${mention}
┃ 
┃ "${lines[Math.floor(Math.random() * lines.length)]}"
┃ 
├─⊷ Quality: ELITE
├─⊷ Success: 99%
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: target ? [target] : [] });
  }
};
