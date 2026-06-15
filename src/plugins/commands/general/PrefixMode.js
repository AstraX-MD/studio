/**
 * @fileOverview Configure Dynamic Prefix Modes.
 */
export default {
  name: "prefixmode",
  aliases: ["setprefixmode", "modeprefix"],
  category: "general",
  description: "Configure how commands are triggered (with or without prefix).",
  usage: "prefixmode <prefix/noprefix/hybrid>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mode = args[0]?.toLowerCase();
    const valid = ['prefix', 'noprefix', 'hybrid'];

    if (!mode || !valid.includes(mode)) {
      const current = await ctx.bot.managers.settings.get('core', 'prefixMode', 'global') || 'prefix';
      return ctx.reply(`┌──⌈ ⚙️ PREFIX MODE ⌋
┃
┃ Current: ${current.toUpperCase()}
┃
├─⊷ prefix: Trigger with ! only
├─⊷ noprefix: No prefix needed
├─⊷ hybrid: Both work (Default)
┃
┃ Usage: !prefixmode hybrid
└────────────────`);
    }

    await ctx.bot.managers.settings.set('core', 'prefixMode', mode, 'global');

    const output = `┌──⌈ ✅ MODE UPDATED ⌋
┃ 
┃ New Mode: ${mode.toUpperCase()}
┃ Scope: GLOBAL
┃ Status: ACTIVE
┃ 
┃ No restart required.
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
