/**
 * @fileOverview Custom welcome message.
 */
export default {
  name: "setwelcome",
  aliases: ["swelcome"],
  category: "admin",
  description: "Set a custom welcome message for new members.",
  usage: "!setwelcome <message>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const text = args.join(' ');
    if (!text) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Content missing.\n└────────────────");
    
    await ctx.bot.managers.settings.set('automation', 'welcome', text, ctx.jid);
    ctx.reply(`┌──⌈ AUTOMATION ⌋\n┃ Task: Welcome Set\n┃ Status: Configured\n└────────────────`);
  }
};