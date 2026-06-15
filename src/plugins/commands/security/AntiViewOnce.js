/**
 * @fileOverview Prevent view-once disappearing messages by recovering content.
 */
export default {
  name: "antiviewonce",
  aliases: ["avo", "norevoke"],
  category: "security",
  description: "Automatically recover and resend 'View Once' photos and videos.",
  usage: "antiviewonce <on/off/dm/groups>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', 'antiviewonce:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'off') config.mode = 'off';
      else if (['on', 'both'].includes(input)) config.mode = 'both';
      else if (['dm', 'groups'].includes(input)) config.mode = input;
      
      await ctx.bot.db.set('security', 'antiviewonce:config', config);
    }

    const output = `┌──⌈ 👁️ ANTI-VIEWONCE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Mode: ${config.mode.toUpperCase()}
┃ Action: RECOVER & RESEND
┃
├─⊷ ${prefix}antiviewonce on
│  └⊷ Restore in all chats
├─⊷ ${prefix}antiviewonce dm
│  └⊷ DMs only
├─⊷ ${prefix}antiviewonce off
│  └⊷ Disable recovery
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
