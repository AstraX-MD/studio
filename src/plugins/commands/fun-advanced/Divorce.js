/**
 * @fileOverview Marriage termination simulation.
 */
export default {
  name: "divorce",
  category: "fun-advanced",
  description: "Terminate a group marriage.",
  usage: "divorce <tag/reply>",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag the person you want to divorce.\n└────────────────");

    const output = `┌──⌈ 💔 DIVORCE ⌋
┃ 
┃ @${ctx.sender.split('@')[0]} is filing 
┃ for divorce from @${target.split('@')[0]}.
┃ 
├─⊷ Status: GRANTED
├─⊷ Reason: Irreconcilable Differences
┃ 
┃ You are now both single.
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, target] });
  }
};
