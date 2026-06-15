/**
 * @fileOverview Get your own profile picture.
 */
export default {
  name: "mypp",
  aliases: ["mepp"],
  category: "profile",
  description: "Retrieve your own profile picture from the server.",
  usage: "mypp",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const url = await ctx.sock.profilePictureUrl(ctx.sender, 'image');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url }, 
        caption: `┌──⌈ 👤 YOUR AVATAR ⌋\n┃ Retrieved successfully.\n└─ 🌌 ${botName.toUpperCase()}` 
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Your PP is hidden or missing.\n└────────────────");
    }
  }
};
