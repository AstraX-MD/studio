/**
 * @fileOverview Logout from WhatsApp.
 */
export default {
  name: "logout",
  category: "owner",
  description: "Unlink the bot from the current WhatsApp session.",
  usage: "logout",
  ownerOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    await ctx.reply(`┌──⌈ 🚪 LOGOUT ⌋\n┃ Status: Disconnecting...\n┃ Session: Terminated\n└─ 🌌 ${botName.toUpperCase()}`);
    
    try {
      await ctx.sock.logout();
    } catch (e) {
      process.exit(0);
    }
  }
};
