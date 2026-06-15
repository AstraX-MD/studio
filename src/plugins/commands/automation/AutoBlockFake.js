/**
 * @fileOverview Automatically block numbers from specific country codes.
 */
export default {
  name: "autoblockfake",
  aliases: ["antibogus", "blockfake"],
  category: "automation",
  description: "Automatically block users with specific international prefixes.",
  usage: "autoblockfake <on/off/codes>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'block:fake:config')) || { mode: 'off', codes: ['+1', '+212', '+92'] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (input.includes('+')) {
        config.codes = input.split(',').map(c => c.trim());
      }
      await ctx.bot.db.set('automation', 'block:fake:config', config);
    }

    const output = `┌──⌈ 🚫 FAKE BLOCKER ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ON'}
┃ Filter: ${config.codes.join(' ')}
┃ Action: AUTO-BLOCK
┃
├─⊷ ${prefix}autoblockfake on
│  └⊷ Enable blocking
├─⊷ ${prefix}autoblockfake <+code>
│  └⊷ Set banned prefixes
├─⊷ ${prefix}autoblockfake off
│  └⊷ Disable blocking
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
