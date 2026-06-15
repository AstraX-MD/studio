/**
 * @fileOverview Fetch vCard data for a contact.
 */
export default {
  name: "contactinfo",
  category: "profile",
  description: "Get the full contact card data for a user.",
  usage: "contactinfo <tag>",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const output = `┌──⌈ 📇 CONTACT CARD ⌋
┃
┃ Name: @${target.split('@')[0]}
┃ Phone: +${target.split('@')[0]}
┃ Status: ACTIVE
┃
└─ 🌌 ${botName.toUpperCase()}`;
    
    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
