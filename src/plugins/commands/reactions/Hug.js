/**
 * @fileOverview Anime hug reaction.
 */
import axios from 'axios';

export default {
  name: "hug",
  category: "reactions",
  description: "Send a hug to someone with a beautiful anime GIF.",
  usage: "hug <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mentionText = target ? `@${target.split('@')[0]}` : "everyone";
    
    try {
      const res = await axios.get('https://api.waifu.pics/sfw/hug');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 🤗 HUG ⌋\n┃ @${ctx.sender.split('@')[0]} hugs ${mentionText}!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: target ? [target, ctx.sender] : [ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Reaction source busy.\n└────────────────");
    }
  }
};
