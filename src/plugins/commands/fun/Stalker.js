/**
 * @fileOverview Prank stalker data.
 */
export default {
  name: "stalker",
  category: "fun",
  description: "Reveal who is 'stalking' a user (Prank).",
  usage: "stalker <tag>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const level = ['Extreme', 'High', 'Moderate', 'Low', 'None'];
    const origin = ['Dark Web', 'Hidden Files', 'Social Registry', 'Node Logs'];

    const output = `┌──⌈ 👁️ STALKER AUDIT ⌋
┃ Target: @${target.split('@')[0]}
┃ 
├─ Threat: ${level[Math.floor(Math.random() * level.length)]}
├─ Source: ${origin[Math.floor(Math.random() * origin.length)]}
├─ Logs: 142 ENTRIES FOUND
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
