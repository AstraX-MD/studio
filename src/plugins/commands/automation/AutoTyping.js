/**
 * @fileOverview Configure simulated typing behavior with detailed control.
 */
export default {
  name: "autotyping",
  aliases: ["atyping", "typing"],
  category: "automation",
  description: "Set the bot to simulate typing before responding.",
  usage: "autotyping <on/off/dm/groups/both/number/seconds>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'typing:config')) || { mode: 'off', duration: 5, targets: [] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['dm', 'groups', 'both'].includes(input)) config.mode = input;
      else if (/^\d+$/.test(input)) {
        const val = parseInt(input);
        if (val > 0 && val <= 120) config.duration = val;
        else {
          const target = input + '@s.whatsapp.net';
          if (config.targets.includes(target)) config.targets = config.targets.filter(t => t !== target);
          else config.targets.push(target);
        }
      }
      await ctx.bot.db.set('automation', 'typing:config', config);
    }

    const output = `╭─⌈ ⌨️ *AUTO-TYPING* ⌋
│
│ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
│ Duration: ${config.duration}s
│ Active: ${config.targets.length} custom
│
├─⊷ *${prefix}autotyping <number>*
│  └⊷ Type only for that user
├─⊷ *${prefix}autotyping dm*
│  └⊷ All DMs
├─⊷ *${prefix}autotyping groups*
│  └⊷ All groups
├─⊷ *${prefix}autotyping both*
│  └⊷ DMs + Groups
├─⊷ *${prefix}autotyping off*
│  └⊷ Disable
├─⊷ *${prefix}autotyping <1-120>*
│  └⊷ Set duration
╰⊷ 🌌 *Powered by ${botName.toUpperCase()}*`;

    ctx.reply(output);
  }
};
