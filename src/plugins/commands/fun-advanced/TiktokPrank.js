/**
 * @fileOverview Fake TikTok Viral Alert.
 */
export default {
  name: "ttviral",
  category: "fun-advanced",
  description: "Generate a fake 'You went viral' TikTok alert.",
  usage: "ttviral <tag>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const views = (Math.floor(Math.random() * 9) + 1) + "M";

    const output = `┌──⌈ 🎵 TIKTOK ALERT ⌋
┃ 
┃ USER: @${target.split('@')[0]}
┃ 
┃ 💥 BOOM! YOUR VIDEO IS VIRAL!
┃ 
├─⊷ VIEWS: ${views}
├─⊷ LIKES: 420K
├─⊷ TREND: #SIGMA
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
