/**
 * @fileOverview Prefix command with WolfBot Box Styling.
 */
export default {
  name: "prefix",
  category: "utility",
  description: "Show current command prefix.",
  usage: "!prefix",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const output = `┌──⌈ CONFIGURATION ⌋
┃ Current Prefix: [ ${prefix} ]
┃ Multi-Prefix: Disabled
┃ Usage: ${prefix}command
└────────────────`;
    await ctx.reply(output);
  }
};