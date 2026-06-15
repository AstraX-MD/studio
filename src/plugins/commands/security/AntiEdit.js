/**
 * @fileOverview Toggle and configure Anti-Edit protection.
 */
export default {
  name: "antiedit",
  aliases: ["ae", "noedit"],
  category: "security",
  description: "Detect and show original content before a message was edited.",
  usage: "antiedit <on/off/dm/groups/both>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', 'antiedit:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['on', 'both'].includes(input)) config.mode = 'both';
      else if (['dm', 'groups'].includes(input)) config.mode = input;
      
      await ctx.bot.db.set('security', 'antiedit:config', config);
    }

    const output = `┌──⌈ ✏️ ANTI-EDIT ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Mode: ${config.mode.toUpperCase()}
┃ Action: LOG ORIGIN
┃
├─⊷ ${prefix}antiedit on
│  └⊷ Enable for all chats
├─⊷ ${prefix}antiedit dm
│  └⊷ DMs only
├─⊷ ${prefix}antiedit groups
│  └⊷ Groups only
├─⊷ ${prefix}antiedit off
│  └⊷ Disable
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
