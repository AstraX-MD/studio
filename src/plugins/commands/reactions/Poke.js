/**
 * @fileOverview Anime poke reaction.
 */
import axios from 'axios';

export default {
  name: "poke",
  category: "reactions",
  description: "Poke someone with an annoying anime GIF.",
  usage: "poke <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mentionText = target ? `@${target.split('@')[0]}` : "themself";

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/poke');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 👉 POKE ⌋\n┃ @${ctx.sender.split('@')[0]} pokes ${mentionText}!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: target ? [target, ctx.sender] : [ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Node busy.");
    }
  }
};
