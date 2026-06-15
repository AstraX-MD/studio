/**
 * @fileOverview Anime cuddle reaction.
 */
import axios from 'axios';

export default {
  name: "cuddle",
  category: "anime",
  description: "Cuddle someone with an anime GIF.",
  usage: "cuddle <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mentionText = target ? `@${target.split('@')[0]}` : "themself";

    try {
      const res = await axios.get('https://nekos.best/api/v2/cuddle');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.results[0].url },
        gifPlayback: true,
        caption: `┌──⌈ 💕 CUDDLE ⌋\n┃ @${ctx.sender.split('@')[0]} cuddles ${mentionText}!\n└─ 🌌 ${botName}`,
        mentions: target ? [target, ctx.sender] : [ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Cuddle source failed.\n└────────────────");
    }
  }
};