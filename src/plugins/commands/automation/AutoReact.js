/**
 * @fileOverview Configure automatic emoji reactions with a professional boxed design.
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

    const output = `┌──⌈ ❤️ AUTO-REACT ⌋
┃
┃ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
┃ List: ${config.emojis.join(' ')}
┃ Custom: ${config.targets.length} Users
┃
├─⊷ ${prefix}autoreact <emojis>
│  └⊷ Set emoji rotation list
├─⊷ ${prefix}autoreact dm
│  └⊷ Apply to all private chats
├─⊷ ${prefix}autoreact groups
│  └⊷ Apply to all group chats
├─⊷ ${prefix}autoreact both
│  └⊷ Apply everywhere
├─⊷ ${prefix}autoreact <number>
│  └⊷ Toggle for specific user
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
