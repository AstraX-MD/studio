/**
 * @fileOverview Automatically react to viewed statuses with a professional design.
 */
export default {
  name: "autolikestatus",
  aliases: ["autolike", "statuslike"],
  category: "automation",
  description: "Automatically react to seen WhatsApp statuses with emojis.",
  usage: "autolikestatus <on/off/emojis>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'status:like:config')) || { mode: 'off', emojis: ['❤️', '🔥', '✨'] };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (input.includes(',') || /[\p{Emoji}]/u.test(input)) {
        config.emojis = input.split(',').map(e => e.trim()).filter(e => e.length > 0);
      }
      await ctx.bot.db.set('automation', 'status:like:config', config);
    }

    const output = `┌──⌈ ❤️ STATUS ENGAGE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ON'}
┃ Emojis: ${config.emojis.join(' ')}
┃ Action: AUTO-REACT
┃
├─⊷ ${prefix}autolikestatus on
│  └⊷ Enable auto-likes
├─⊷ ${prefix}autolikestatus <emojis>
│  └⊷ Set reaction pool
├─⊷ ${prefix}autolikestatus off
│  └⊷ Disable feature
┃
┃ (Requires ${prefix}autoviewstatus ON)
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
