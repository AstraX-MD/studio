/**
 * @fileOverview Anime kiss reaction.
 */
import axios from 'axios';

export default {
  name: "kiss",
  category: "anime",
  description: "Kiss someone with an anime GIF.",
  usage: "kiss <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Please tag or reply to someone.\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/kiss');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 💋 KISS ⌋\n┃ @${ctx.sender.split('@')[0]} kissed @${target.split('@')[0]}!\n└─ 🌌 ${botName}`,
        mentions: [target, ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to load reaction.\n└────────────────");
    }
  }
};