/**
 * @fileOverview YouTube Channel Stalker with 10+ redundant APIs.
 */
import axios from 'axios';

export default {
  name: "ytstalker",
  aliases: ["ytstalk", "ytp"],
  category: "stalker",
  description: "Analyze any YouTube channel profile data.",
  usage: "ytstalker <name/handle>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Channel name missing.\n└────────────────");

    const fallbacks = [
      `https://api.agatz.xyz/api/ytstalk?query=${encodeURIComponent(query)}`,
      `https://api.vytmp3.com/ytstalk?query=${encodeURIComponent(query)}`,
      `https://api.dlow.xyz/api/ytstalk?q=${encodeURIComponent(query)}`,
      `https://api.zahwazein.xyz/api/stalk/youtube?username=${encodeURIComponent(query)}`,
      `https://api.paxsenix.biz.id/api/stalk/youtube?username=${encodeURIComponent(query)}`,
      `https://api.caliph.biz.id/api/stalk/youtube?username=${encodeURIComponent(query)}`,
      `https://api.miftah.xyz/api/stalk/youtube?username=${encodeURIComponent(query)}`,
      `https://api.yanzbotz.my.id/api/stalk/youtube?username=${encodeURIComponent(query)}`,
      `https://api.xyter.com/ytstalk?q=${encodeURIComponent(query)}`,
      `https://api.erdwpe.my.id/api/stalk/youtube?username=${encodeURIComponent(query)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.channelName) {
          const output = `┌──⌈ 🕵️ YT AUDIT ⌋
┃
┃ Name: ${d.channelName}
┃ Handle: ${d.channelHandle || '@' + d.channelId}
┃
├─⊷ Subs: ${d.subscriberCount || d.subscribers}
├─⊷ Views: ${d.viewCount || d.views}
├─⊷ Videos: ${d.videoCount}
┃
┃ Bio: ${d.description?.substring(0, 200)}...
┃ Joined: ${d.publishedAt || 'N/A'}
┃ Status: ACTIVE
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.channelThumbnail || d.avatar }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Channel analysis failed.\n└────────────────");
  }
};
