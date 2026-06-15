/**
 * @fileOverview Protect the bot and groups from rapid message flood.
 */
export default {
  name: "antispam",
  aliases: ["floodfilter", "nospam"],
  category: "security",
  description: "Detect and punish users sending messages too rapidly.",
  usage: "antispam <on/off/dm/groups/kick/warn>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', 'antispam:config')) || { mode: 'off', action: 'warn', threshold: 5 };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['on', 'groups', 'dm'].includes(input)) config.mode = input;
      else if (['kick', 'warn', 'delete', 'mute'].includes(input)) config.action = input;
      else if (/^\d+$/.test(input)) config.threshold = parseInt(input);
      
      await ctx.bot.db.set('security', 'antispam:config', config);
    }

    const output = `┌──⌈ 🚫 ANTI-SPAM ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Mode: ${config.mode.toUpperCase()}
┃ Limit: ${config.threshold} msg / 10s
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antispam on
│  └⊷ Protect all chats
├─⊷ ${prefix}antispam groups
│  └⊷ Groups only
├─⊷ ${prefix}antispam <number>
│  └⊷ Set msg threshold
├─⊷ ${prefix}antispam kick
│  └⊷ Kick on violation
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
