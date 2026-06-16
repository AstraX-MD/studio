/**
 * @fileOverview Anime headpat reaction.
 */
import axios from 'axios';

export default {
  name: "pat",
  category: "reactions",
  description: "Pat someone's head with a cute anime GIF.",
  usage: "pat <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mentionText = target ? `@${target.split('@')[0]}` : "themself";

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/pat');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 👋 PAT ⌋\n┃ @${ctx.sender.split('@')[0]} pats ${mentionText}!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: target ? [target, ctx.sender] : [ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Source offline.");
    }
  }
};
