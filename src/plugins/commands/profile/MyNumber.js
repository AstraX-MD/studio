/**
 * @fileOverview Display the bot's current phone number.
 */
export default {
  name: "mynumber",
  category: "profile",
  description: "Display the bot's registered phone number.",
  usage: "mynumber",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const number = ctx.sock.user.id.split(':')[0];

    const output = `┌──⌈ 📱 BOT NUMBER ⌋
┃
┃ Identity: ${botName}
┃ Number: +${number}
┃ JID: ${ctx.sock.user.id}
┃
└─ 🌌 AstraX Enterprise`;
    ctx.reply(output);
  }
};
