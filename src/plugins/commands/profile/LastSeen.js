/**
 * @fileOverview (Mock) Check last seen of a user.
 */
export default {
  name: "lastseen",
  category: "profile",
  description: "Attempt to check when a user was last online.",
  usage: "lastseen <tag>",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const output = `┌──⌈ 🕒 LAST SEEN ⌋
┃
┃ Target: @${target.split('@')[0]}
┃ Status: PRIVACY RESTRICTED
┃ 
┃ Note: The server only 
┃ returns this if their 
┃ privacy is set to 'Everyone'.
┃
└─ 🌌 ${botName.toUpperCase()}`;
    
    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
