/**
 * @fileOverview Fake Wanted Poster.
 */
export default {
  name: "wanted",
  aliases: ["bounty", "outlaw"],
  category: "fun-advanced",
  description: "Generate a 'Wanted' bounty poster for a user.",
  usage: "wanted <tag/reply>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const bounty = (Math.floor(Math.random() * 900) + 100) + ",000,000";
    const crime = ['Being Too Cute', 'Spamming Stickers', 'Stealing Memes', 'Ghosting DMs', 'Sigma Overdose'];

    const output = `┌──⌈ 📜 WANTED ⌋
┃ 
┃ TARGET: @${target.split('@')[0]}
┃ BOUNTY: ฿ ${bounty}
┃ 
├─⊷ CRIME: ${crime[Math.floor(Math.random() * crime.length)]}
├─⊷ STATUS: DEAD OR ALIVE
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
