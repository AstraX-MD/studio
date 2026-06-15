/**
 * @fileOverview Love compatibility ship.
 */
export default {
  name: "ship",
  aliases: ["love", "compatibility"],
  category: "fun",
  description: "Check love compatibility between two users.",
  usage: "ship <tag1> <tag2>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mentions = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length < 2) {
        return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag two users to ship.\n└────────────────");
    }

    const percent = Math.floor(Math.random() * 101);
    const comment = percent > 80 ? 'SOULMATES' : percent > 50 ? 'GOOD MATCH' : 'NOT COMPATIBLE';

    const output = `┌──⌈ 💖 SHIP ⌋
┃ Target 1: @${mentions[0].split('@')[0]}
┃ Target 2: @${mentions[1].split('@')[0]}
┃ 
├─ Love: ${percent}%
├─ Status: ${comment}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions });
  }
};
