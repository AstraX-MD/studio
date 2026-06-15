/**
 * @fileOverview Toggle automatic read receipts with a professional boxed design.
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

    const output = `┌──⌈ ✅ AUTO-READ ⌋
┃
┃ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
┃ Scope: ${config.mode.toUpperCase()}
┃ Active: ${config.targets.length} Custom
┃
├─⊷ ${prefix}autoread dm
│  └⊷ Auto-read in DMs
├─⊷ ${prefix}autoread groups
│  └⊷ Auto-read in Groups
├─⊷ ${prefix}autoread both
│  └⊷ Read all messages
├─⊷ ${prefix}autoread off
│  └⊷ Disable feature
├─⊷ ${prefix}autoread <number>
│  └⊷ Specific user targeting
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
