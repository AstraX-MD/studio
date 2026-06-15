/**
 * @fileOverview Change the bot's display name.
 */
export default {
  name: "setbotname",
  category: "sudo",
  description: "Update the bot's identification name.",
  usage: "!setbotname <name>",
  permissions: 9,
  execute: async (ctx, args) => {
    const newName = args.join(' ');
    if (!newName) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Name cannot be empty.\n└────────────────");

    await ctx.bot.managers.settings.set('core', 'name', newName, 'global');

    const output = `┌──⌈ SYSTEM UPDATE ⌋
┃ Target: Bot Identity
┃ Action: Name Updated
┃ Value: ${newName}
└────────────────`;
    await ctx.reply(output);
  }
};