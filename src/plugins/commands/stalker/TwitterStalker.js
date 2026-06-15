/**
 * @fileOverview Twitter (X) Profile Stalker with 10+ redundant APIs.
 */
import axios from 'axios';

export default {
  name: "twstalker",
  aliases: ["xstalk", "twp"],
  category: "stalker",
  description: "Extract comprehensive data from any Twitter/X profile.",
  usage: "twstalker <username>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0]?.replace('@', '');

    if (!user) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ X handle required.\n└────────────────");

    const fallbacks = [
      `https://api.agatz.xyz/api/twitter_stalk?username=${user}`,
      `https://api.paxsenix.biz.id/api/stalk/twitter?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/twitter?username=${user}`,
      `https://api.caliph.biz.id/api/stalk/twitter?username=${user}`,
      `https://api.miftah.xyz/api/stalk/twitter?username=${user}`,
      `https://api.yanzbotz.my.id/api/stalk/twitter?username=${user}`,
      `https://api.xyter.com/twitter?user=${user}`,
      `https://api.vytmp3.com/twstalk?user=${user}`,
      `https://api.dlow.xyz/api/twstalk?q=${user}`,
      `https://api.erdwpe.my.id/api/stalk/twitter?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.screen_name) {
          const output = `┌──⌈ 🕵️ X AUDIT ⌋
┃
┃ Handle: @${d.screen_name}
┃ Identity: ${d.name}
┃
├─⊷ Fans: ${d.followers_count?.toLocaleString()}
├─⊷ Flow: ${d.friends_count?.toLocaleString()}
├─⊷ Posts: ${d.statuses_count?.toLocaleString()}
├─⊷ Likes: ${d.favourites_count?.toLocaleString()}
┃
┃ Bio: ${d.description || 'No bio.'}
┃ Loc: ${d.location || 'The Web'}
┃ Joined: ${d.created_at}
┃ Verified: ${d.verified ? '💎 YES' : '❌ NO'}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.profile_image_url_https?.replace('_normal', '_400x400') }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Extraction failed.\n└────────────────");
  }
};
