/**
 * @fileOverview Configure automatic emoji reactions with a unique AstraX frame design.
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

    const output = `┍━━━━━━━━━━━━━━━┑
   ❤️ REACTION HUB    
┕━━━━━━━━━━━━━━━┙
┝  ◌ Mode: ${config.mode.toUpperCase()}
┝  ◌ List: ${config.emojis.join(' ')}
┝  ◌ Custom: ${config.targets.length} Users
┝━━━━━━━━━━━━━━━
┝  ▹ ${prefix}autoreact <emojis>
┝  ▹ ${prefix}autoreact dm
┝  ▹ ${prefix}autoreact groups
┝  ▹ ${prefix}autoreact both
┝  ▹ ${prefix}autoreact off
┝  ▹ ${prefix}autoreact <number>
┕━━━━━━━━━━━━━━━
  © ${botName.toUpperCase()} SYSTEMS`;

    ctx.reply(output);
  }
};
