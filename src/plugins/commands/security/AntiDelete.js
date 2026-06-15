/**
 * @fileOverview Toggle and configure Anti-Delete protection.
 */
export default {
  name: "antidelete",
  aliases: ["ad", "nodelete"],
  category: "security",
  description: "Detect and restore deleted messages in the chat.",
  usage: "antidelete <on/off/dm/groups/both>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', 'antidelete:config')) || { mode: 'off', targets: [] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['on', 'both'].includes(input)) config.mode = 'both';
      else if (['dm', 'groups'].includes(input)) config.mode = 'dm';
      
      await ctx.bot.db.set('security', 'antidelete:config', config);
    }

    const output = `┌──⌈ 🗑️ ANTI-DELETE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Mode: ${config.mode.toUpperCase()}
┃ Action: LOG & RESTORE
┃
├─⊷ ${prefix}antidelete on
│  └⊷ Enable for all chats
├─⊷ ${prefix}antidelete dm
│  └⊷ Protect DMs only
├─⊷ ${prefix}antidelete groups
│  └⊷ Protect Groups only
├─⊷ ${prefix}antidelete off
│  └⊷ Disable protection
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
