/**
 * @fileOverview AI-powered toxicity and harassment filter.
 */
export default {
  name: "antitoxic",
  aliases: ["antiabuse", "warcen"],
  category: "security",
  description: "AI-powered filtering for hate speech, harassment, and toxic content.",
  usage: "antitoxic <on/off/kick/warn>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antitoxic:${ctx.jid}`)) || { mode: 'off', action: 'warn' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antitoxic:${ctx.jid}`, config);
    }

    const output = `┌──⌈ ☣️ ANTI-TOXIC ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Engine: GENKIT AI
┃ Action: ${config.action.toUpperCase()}
┃ Scope: CURRENT GROUP
┃
├─⊷ ${prefix}antitoxic on
│  └⊷ Enable AI monitoring
├─⊷ ${prefix}antitoxic action kick
│  └⊷ Instant removal
├─⊷ ${prefix}antitoxic off
│  └⊷ Disable monitoring
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
