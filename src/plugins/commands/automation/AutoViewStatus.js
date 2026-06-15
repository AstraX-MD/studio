/**
 * @fileOverview Toggle automatic status viewing with a unique AstraX frame design.
 */
export default {
  name: "autoviewstatus",
  aliases: ["autostatus", "readstatus"],
  category: "automation",
  description: "Automatically view and log WhatsApp statuses.",
  usage: "autoviewstatus <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'status:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('automation', 'status:config', config);
    }

    const output = `┍━━━━━━━━━━━━━━━┑
   👁️ STATUS WARDEN   
┕━━━━━━━━━━━━━━━┙
┝  ◌ Mode: ${config.mode.toUpperCase()}
┝  ◌ Action: AUTO-VIEW
┝  ◌ Log: ENABLED
┝━━━━━━━━━━━━━━━
┝  ▹ ${prefix}autoviewstatus on
┝  ▹ ${prefix}autoviewstatus off
┝
┝  (Views all contacts)
┕━━━━━━━━━━━━━━━
  © ${botName.toUpperCase()} SYSTEMS`;

    ctx.reply(output);
  }
};
