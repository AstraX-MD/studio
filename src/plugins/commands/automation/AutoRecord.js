/**
 * @fileOverview Configure simulated audio recording status with a unique AstraX frame design.
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
    
    const config = (await ctx.bot.db.get('automation', 'record:config')) || { mode: 'off', duration: 10, targets: [] };
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
      await ctx.bot.db.set('automation', 'record:config', config);
    }

    const output = `┍━━━━━━━━━━━━━━━┑
   🎙️ RECORDING HUB   
┕━━━━━━━━━━━━━━━┙
┝  ◌ Mode: ${config.mode.toUpperCase()}
┝  ◌ Time: ${config.duration}s
┝  ◌ Custom: ${config.targets.length} Users
┝━━━━━━━━━━━━━━━
┝  ▹ ${prefix}autorecord dm
┝  ▹ ${prefix}autorecord groups
┝  ▹ ${prefix}autorecord both
┝  ▹ ${prefix}autorecord off
┝  ▹ ${prefix}autorecord <1-120>
┝  ▹ ${prefix}autorecord <number>
┕━━━━━━━━━━━━━━━
  © ${botName.toUpperCase()} SYSTEMS`;

    ctx.reply(output);
  }
};
