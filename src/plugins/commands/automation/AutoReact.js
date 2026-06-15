/**
 * @fileOverview Configure automatic emoji reactions with rotations.
 */
export default {
  name: "autoreact",
  aliases: ["react"],
  category: "automation",
  description: "Configure automatic reactions to incoming messages.",
  usage: "autoreact <on/off/dm/groups/both/emojis>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'react:config')) || { mode: 'off', emojis: ['🔥'], targets: [] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['dm', 'groups', 'both'].includes(input)) config.mode = input;
      else if (input.includes(',') || (input.length <= 2 && /[\p{Emoji}]/u.test(input))) {
        config.emojis = input.split(',').filter(e => e.trim().length > 0);
      } else if (/^\d+$/.test(input)) {
        const target = input + '@s.whatsapp.net';
        if (config.targets.includes(target)) config.targets = config.targets.filter(t => t !== target);
        else config.targets.push(target);
      }
      await ctx.bot.db.set('automation', 'react:config', config);
    }

    const output = `╭─⌈ ❤️ *AUTO-REACT* ⌋
│
│ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
│ Rotation: ${config.emojis.join(' ')}
│ Active: ${config.targets.length} custom
│
├─⊷ *${prefix}autoreact <emojis>*
│  └⊷ Set emoji list (comma separated)
│  └⊷ e.g. ${prefix}autoreact 🔥,❤️,✅
├─⊷ *${prefix}autoreact dm*
│  └⊷ All DMs
├─⊷ *${prefix}autoreact groups*
│  └⊷ All groups
├─⊷ *${prefix}autoreact both*
│  └⊷ DMs + Groups
├─⊷ *${prefix}autoreact off*
│  └⊷ Disable
├─⊷ *${prefix}autoreact <number>*
│  └⊷ React only for specific user
╰⊷ 🌌 *Powered by ${botName.toUpperCase()}*`;

    ctx.reply(output);
  }
};
