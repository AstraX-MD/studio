/**
 * @fileOverview Fetch the push name of a user.
 */
export default {
  name: "getname",
  category: "profile",
  description: "Get the profile name of a user.",
  usage: "getname <tag/reply>",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) target = ctx.sender;

    const output = `┌──⌈ 🏷️ NAME TAG ⌋
┃
┃ Target: @${target.split('@')[0]}
┃ PushName: ${ctx.pushName}
┃
└─ 🌌 ${botName.toUpperCase()}`;
    
    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
