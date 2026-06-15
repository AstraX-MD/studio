/**
 * @fileOverview Keep the bot appearing online 24/7.
 */
export default {
  name: "autoalwaysonline",
  aliases: ["alwaysonline", "online"],
  category: "automation",
  description: "Keep the bot's presence status as 'Online' indefinitely.",
  usage: "autoalwaysonline <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'presence:online:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('automation', 'presence:online:config', config);
      
      // Immediate update
      if (input === 'on') {
        await ctx.sock.sendPresenceUpdate('available');
      } else {
        await ctx.sock.sendPresenceUpdate('unavailable');
      }
    }

    const output = `┌──⌈ 🟢 ALWAYS ONLINE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Presence: AVAILABLE
┃ Persistence: 24/7
┃
├─⊷ ${prefix}autoalwaysonline on
│  └⊷ Set 'Online' status
├─⊷ ${prefix}autoalwaysonline off
│  └⊷ Follow default behavior
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
