/**
 * @fileOverview High-performance TikTok Profile Stalker with 10+ fallbacks.
 */
import axios from 'axios';

export default {
  name: "tstalker",
  aliases: ["tiktokstalk", "tprofile"],
  category: "stalker",
  description: "Fetch comprehensive profile data for any TikTok username.",
  usage: "tstalker <username>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}tstalker username\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🕵️ SCANNING ⌋\n┃ Target: ${user}\n┃ Status: Querying Databases...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/tiktok_stalk?username=${user}`,
      `https://api.dlow.xyz/api/tiktok_stalk?q=${user}`,
      `https://api.vytmp3.com/tiktok_stalk?user=${user}`,
      `https://api.xyter.com/tiktokstalk?user=${user}`,
      `https://api.zahwazein.xyz/api/stalk/tiktok?username=${user}`,
      `https://api.miftah.xyz/api/stalk/tiktok?username=${user}`,
      `https://api.caliph.biz.id/api/stalk/tiktok?username=${user}`,
      `https://api.paxsenix.biz.id/api/stalk/tiktok?username=${user}`,
      `https://api.yanzbotz.my.id/api/stalk/tiktok?username=${user}`,
      `https://api.erdwpe.my.id/api/stalk/tiktok?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.username) {
          const output = `┌──⌈ 🕵️ TIKTOK AUDIT ⌋
┃
┃ Username: ${d.username}
┃ Nickname: ${d.nickname || d.name}
┃
├─⊷ Follow: ${d.following?.toLocaleString()}
├─⊷ Fans: ${d.followers?.toLocaleString()}
├─⊷ Likes: ${d.heartCount || d.likes?.toLocaleString()}
├─⊷ Videos: ${d.videoCount || 'N/A'}
┃
┃ Bio: ${d.signature || d.description || 'No bio found.'}
┃ Verification: ${d.verified ? '✅ Verified' : '❌ Standard'}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.avatar || d.profile_pic }, 
            caption: output,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ User not found or All scrapers busy.\n└────────────────`);
  }
};
