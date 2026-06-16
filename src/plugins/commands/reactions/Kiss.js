/**
 * @fileOverview Anime kiss reaction.
 */
import axios from 'axios';

export default {
  name: "kiss",
  category: "reactions",
  description: "Kiss someone with a romantic anime GIF.",
  usage: "kiss <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag someone to kiss!\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/kiss');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 💋 KISS ⌋\n┃ @${ctx.sender.split('@')[0]} kissed @${target.split('@')[0]}!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [target, ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content unavailable.");
    }
  }
};
