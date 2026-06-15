/**
 * @fileOverview Change the bot's command prefix.
 */
export default {
  name: "setprefix",
  category: "sudo",
  description: "Change the global command prefix.",
  usage: "!setprefix <symbol>",
  permissions: 9,
  execute: async (ctx, args) => {
    const newPrefix = args[0];
    if (!newPrefix || newPrefix.length > 3) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Invalid prefix symbol.\n└────────────────");

    await ctx.bot.managers.settings.set('core', 'prefix', newPrefix, 'global');

    const output = `┌──⌈ SYSTEM UPDATE ⌋
┃ Target: Global Config
┃ Action: Prefix Updated
┃ Value: [ ${newPrefix} ]
└────────────────`;
    await ctx.reply(output);
  }
};