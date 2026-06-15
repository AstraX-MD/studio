/**
 * @fileOverview Configure simulated audio recording status.
 */
export default {
  name: "autorecord",
  aliases: ["arecord", "recording"],
  category: "automation",
  description: "Set the bot to simulate recording audio before responding.",
  usage: "autorecord <on/off> [seconds] [all/dm/groups/@tag]",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    if (!args[0]) {
      return ctx.reply(`┌──⌈ 🎙️ RECORD CONFIG ⌋
┃ 
┃ Use: ${prefix}autorecord <on/off>
┃ Extra: [seconds] [target]
┃ 
└─ 🌌 ${botName.toUpperCase()}`);
    }

    const state = args[0].toLowerCase() === 'on';
    const duration = parseInt(args[1]) || 5;
    let target = 'all';

    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (args[2]) {
      target = args[2].toLowerCase();
    }

    const config = { enabled: state, duration, target };
    await ctx.bot.db.set('automation', `record:${target}`, config);

    const output = `┌──⌈ ✅ AUTO-RECORD ⌋
┃ 
┃ Status: ${state ? 'ENABLED' : 'DISABLED'}
┃ Duration: ${duration}s
┃ Scope: ${target}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
