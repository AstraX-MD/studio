/**
 * @fileOverview Toggle automatic read receipts (Blue Ticks).
 */
export default {
  name: "autoread",
  aliases: ["read", "bluetick"],
  category: "automation",
  description: "Automatically mark messages as read.",
  usage: "autoread <on/off/dm/groups/both/number>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'read:config')) || { mode: 'off', targets: [] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['dm', 'groups', 'both'].includes(input)) config.mode = input;
      else if (/^\d+$/.test(input)) {
        const target = input + '@s.whatsapp.net';
        if (config.targets.includes(target)) config.targets = config.targets.filter(t => t !== target);
        else config.targets.push(target);
      }
      await ctx.bot.db.set('automation', 'read:config', config);
    }

    const output = `╭─⌈ ✅ *AUTO-READ* ⌋
│
│ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
│ Status: Blue Tick Active
│ Active: ${config.targets.length} custom
│
├─⊷ *${prefix}autoread dm*
│  └⊷ Mark all DMs as read
├─⊷ *${prefix}autoread groups*
│  └⊷ Mark all groups as read
├─⊷ *${prefix}autoread both*
│  └⊷ All chats
├─⊷ *${prefix}autoread off*
│  └⊷ Disable auto-read
├─⊷ *${prefix}autoread <number>*
│  └⊷ Read only for specific user
╰⊷ 🌌 *Powered by ${botName.toUpperCase()}*`;

    ctx.reply(output);
  }
};
