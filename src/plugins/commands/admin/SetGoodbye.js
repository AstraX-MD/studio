/**
 * @fileOverview Custom goodbye message.
 */
export default {
  name: "setgoodbye",
  aliases: ["sgoodbye"],
  category: "admin",
  description: "Set a custom message for when members leave.",
  usage: "!setgoodbye <message>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const text = args.join(' ');
    if (!text) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Content missing.\n└────────────────");
    
    await ctx.bot.managers.settings.set('automation', 'goodbye', text, ctx.jid);
    ctx.reply(`┌──⌈ AUTOMATION ⌋\n┃ Task: Goodbye Set\n┃ Status: Configured\n└────────────────`);
  }
};