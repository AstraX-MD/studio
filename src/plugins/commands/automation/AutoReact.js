/**
 * @fileOverview Configure automatic emoji reactions with rotation.
 */
export default {
  name: "autoreact",
  aliases: ["react"],
  category: "automation",
  description: "Configure automatic reactions to incoming messages.",
  usage: "autoreact <on/off> [emojis] [target]",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    if (!args[0]) {
      return ctx.reply(`┌──⌈ ❤️ REACT CONFIG ⌋
┃ 
┃ Use: ${prefix}autoreact on 🔥,❤️,✅
┃ 
┃ Note: Separate emojis by comma.
┃ Default target: all
┃ 
└─ 🌌 ${botName.toUpperCase()}`);
    }

    const state = args[0].toLowerCase() === 'on';
    const emojis = args[1] ? args[1].split(',') : ['🔥'];
    let target = 'all';

    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    }

    const config = { enabled: state, emojis, target };
    await ctx.bot.db.set('automation', `react:${target}`, config);

    const output = `┌──⌈ ✅ AUTO-REACT ⌋
┃ 
┃ Status: ${state ? 'ENABLED' : 'DISABLED'}
┃ Emojis: ${emojis.join(' ')}
┃ Scope: ${target}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
