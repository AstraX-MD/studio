/**
 * @fileOverview Configure simulated audio recording status with granular targeting.
 */
export default {
  name: "autorecord",
  aliases: ["arecord", "recording"],
  category: "automation",
  description: "Set the bot to simulate recording audio before responding.",
  usage: "autorecord <on/off/dm/groups/both/number/seconds>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    // Fetch Current Config
    const config = (await ctx.bot.db.get('automation', 'record:config')) || { mode: 'off', duration: 10, targets: [] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') {
        config.mode = 'off';
      } else if (input === 'dm' || input === 'groups' || input === 'both') {
        config.mode = input;
      } else if (/^\d+$/.test(input)) {
        const val = parseInt(input);
        if (val > 0 && val <= 120) {
          config.duration = val;
        } else {
          // Treat as phone number
          const target = input + '@s.whatsapp.net';
          if (config.targets.includes(target)) {
            config.targets = config.targets.filter(t => t !== target);
          } else {
            config.targets.push(target);
          }
        }
      }
      await ctx.bot.db.set('automation', 'record:config', config);
    }

    const output = `╭─⌈ 🎤 *AUTO-RECORDING* ⌋
│
│ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
│ Duration: ${config.duration}s
│ Active: ${config.targets.length} custom
│
├─⊷ *${prefix}autorecord <number>*
│  └⊷ Record only in that person's DM
│  └⊷ e.g. ${prefix}autorecord 254703397679
├─⊷ *${prefix}autorecord dm*
│  └⊷ All DMs
├─⊷ *${prefix}autorecord groups*
│  └⊷ All groups
├─⊷ *${prefix}autorecord both*
│  └⊷ DMs + Groups
├─⊷ *${prefix}autorecord off*
│  └⊷ Disable
├─⊷ *${prefix}autorecord <1-120>*
│  └⊷ Set duration
╰⊷ 🌌 *Powered by ${botName.toUpperCase()}*`;

    ctx.reply(output);
  }
};
