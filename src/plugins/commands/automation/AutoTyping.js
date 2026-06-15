/**
 * @fileOverview Configure simulated typing behavior with granular scoping.
 */
export default {
  name: "autotyping",
  aliases: ["atyping", "typing"],
  category: "automation",
  description: "Set the bot to simulate typing before responding.",
  usage: "autotyping <on/off> [seconds] [all/dm/groups/@tag]",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    if (!args[0]) {
      return ctx.reply(`┌──⌈ ⌨️ TYPING CONFIG ⌋
┃ 
┃ Use: ${prefix}autotyping <on/off>
┃ Extra: [seconds] [target]
┃ 
┃ Targets:
├─ all (Global)
├─ dm (Private only)
├─ groups (Groups only)
├─ @tag (Specific user)
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
    await ctx.bot.db.set('automation', `typing:${target}`, config);

    const output = `┌──⌈ ✅ AUTO-TYPING ⌋
┃ 
┃ Status: ${state ? 'ENABLED' : 'DISABLED'}
┃ Duration: ${duration}s
┃ Scope: ${target === 'all' ? 'Global' : target}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
