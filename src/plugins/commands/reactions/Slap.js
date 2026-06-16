/**
 * @fileOverview Anime slap reaction.
 */
import axios from 'axios';

export default {
  name: "slap",
  category: "reactions",
  description: "Slap someone with a powerful anime GIF.",
  usage: "slap <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Who are you slapping?\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/slap');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 💢 SLAP ⌋\n┃ @${ctx.sender.split('@')[0]} slapped @${target.split('@')[0]}!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [target, ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Slap unit busy.");
    }
  }
};
