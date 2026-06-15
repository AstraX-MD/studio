/**
 * @fileOverview Instagram Profile Stalker with 10+ redundant APIs.
 */
import axios from 'axios';

export default {
  name: "igstalker",
  aliases: ["igstalk", "igprofile"],
  category: "stalker",
  description: "Extract deep metadata from any Instagram profile.",
  usage: "igstalker <username>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Username required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/insta_stalk?username=${user}`,
      `https://api.vytmp3.com/igstalk?user=${user}`,
      `https://api.dlow.xyz/api/igstalk?q=${user}`,
      `https://api.xyter.com/igstalk?user=${user}`,
      `https://api.zahwazein.xyz/api/stalk/instagram?username=${user}`,
      `https://api.paxsenix.biz.id/api/stalk/instagram?username=${user}`,
      `https://api.caliph.biz.id/api/stalk/instagram?username=${user}`,
      `https://api.miftah.xyz/api/stalk/instagram?username=${user}`,
      `https://api.yanzbotz.my.id/api/stalk/instagram?username=${user}`,
      `https://api.erdwpe.my.id/api/stalk/instagram?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.username) {
          const output = `┌──⌈ 🕵️ INSTA AUDIT ⌋
┃
┃ Username: ${d.username}
┃ Full Name: ${d.full_name}
┃
├─⊷ Follow: ${d.following?.toLocaleString()}
├─⊷ Fans: ${d.followers?.toLocaleString()}
├─⊷ Posts: ${d.posts_count || d.media_count?.toLocaleString()}
┃
┃ Bio: ${d.biography || 'No bio.'}
┃ Private: ${d.is_private ? '🔒 YES' : '🔓 NO'}
┃ Verified: ${d.is_verified ? '💎 YES' : '❌ NO'}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.profile_pic_url || d.avatar }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Extraction failed.\n└────────────────`);
  }
};
