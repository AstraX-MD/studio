/**
 * @fileOverview Comprehensive profile lookup.
 */
export default {
  name: "whois",
  aliases: ["inspect", "userinfo"],
  category: "profile",
  description: "Get detailed information about a user profile.",
  usage: "whois <tag/reply/number>",
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target;
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
      target = ctx.sender;
    }

    const role = await ctx.bot.managers.roles.getRole(target);
    const userId = target.split('@')[0];

    const output = `┌──⌈ 🔍 WHOIS LOOKUP ⌋
┃
┃ User: @${userId}
┃ Role: ${role >= 9 ? 'OWNER' : role >= 8 ? 'SUDO' : 'USER'}
┃ Level: ${role}
┃ JID: ${target}
┃
├─⊷ Contacting server...
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
