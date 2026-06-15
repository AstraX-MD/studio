/**
 * @fileOverview Anime slap reaction.
 */
import axios from 'axios';

export default {
  name: "slap",
  category: "anime",
  description: "Slap someone with an anime GIF.",
  usage: "slap <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Who do you want to slap?\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/slap');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 💢 SLAP ⌋\n┃ @${ctx.sender.split('@')[0]} slapped @${target.split('@')[0]}!\n└─ 🌌 ${botName}`,
        mentions: [target, ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Reaction failed.\n└────────────────");
    }
  }
};