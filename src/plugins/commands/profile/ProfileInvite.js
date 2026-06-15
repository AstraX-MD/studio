/**
 * @fileOverview Generate a deep link to the bot's profile.
 */
export default {
  name: "profileinvite",
  aliases: ["myqr", "botlink"],
  category: "profile",
  description: "Get a direct link or QR code to the bot's private chat.",
  usage: "profileinvite",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const number = ctx.sock.user.id.split(':')[0];
    const link = `https://wa.me/${number}`;

    const output = `┌──⌈ 🔗 BOT INVITE ⌋
┃
┃ Link: ${link}
┃ Status: Direct Messaging
┃ 
┃ Share this link to allow
┃ users to start a DM.
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
