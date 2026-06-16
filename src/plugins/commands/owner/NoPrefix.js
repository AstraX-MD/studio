/**
 * @fileOverview Toggle the No-Prefix mode globally.
 */
export default {
  name: "noprefix",
  category: "owner",
  description: "Allow commands to be triggered without a prefix.",
  usage: "noprefix <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = ctx.bot.config.name || "AstraX";
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'off') {
      const state = mode === 'on';
      await ctx.db.set('noPrefix', state);
      
      const output = `┌──⌈ 🔑 NO-PREFIX ⌋
┃
┃ Status: ${state ? '✅ ENABLED' : '❌ DISABLED'}
┃ Scope: GLOBAL
┃ Mode: HYBRID
┃
├─⊷ On: Trigger cmds without '?'
├─⊷ Off: Prefix required
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      return ctx.reply(output);
    }

    const current = await ctx.db.get('noPrefix');
    ctx.reply(`┌──⌈ ⚙️ CONFIG ⌋\n┃\n┃ No-Prefix: ${current ? 'ON' : 'OFF'}\n┃ Usage: !noprefix on\n└────────────────`);
  }
};
