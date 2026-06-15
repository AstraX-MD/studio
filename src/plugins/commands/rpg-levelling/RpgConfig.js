/**
 * @fileOverview Enable or Disable RPG Levelling per group.
 */
export default {
  name: "rpgconfig",
  aliases: ["setrpg"],
  category: "rpg-levelling",
  description: "Toggle the RPG levelling system for this group.",
  usage: "rpgconfig <on/off>",
  permissions: 5, // ADMIN
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'off') {
      await ctx.bot.db.set('settings', `rpg_enabled:${ctx.jid}`, mode === 'on');
      
      const output = `┌──⌈ ⚔️ RPG SYSTEM ⌋
┃
┃ Status: ${mode === 'on' ? '✅ ENABLED' : '❌ DISABLED'}
┃ Group: ${ctx.jid.split('@')[0]}
┃ Action: GLOBAL UPDATE
┃
└────────────────
  © ${botName.toUpperCase()}`;
      return ctx.reply(output);
    }

    const current = await ctx.bot.db.get('settings', `rpg_enabled:${ctx.jid}`) || false;
    ctx.reply(`┌──⌈ ⚙️ RPG CONFIG ⌋\n┃\n┃ Current: ${current ? 'ON' : 'OFF'}\n┃ Usage: !rpgconfig on/off\n└────────────────`);
  }
};
