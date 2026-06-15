/**
 * @fileOverview Facebook Profile Stalker with 10+ redundant APIs.
 */
import axios from 'axios';

export default {
  name: "fbstalker",
  aliases: ["fbstalk", "fbprofile"],
  category: "stalker",
  description: "Extract deep metadata from any public Facebook profile.",
  usage: "fbstalker <username/uid>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Username or UID required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/facebook_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/facebook?username=${user}`,
      `https://api.vytmp3.com/fbstalk?user=${user}`,
      `https://api.dlow.xyz/api/fbstalk?q=${user}`,
      `https://api.xyter.com/fbstalk?user=${user}`,
      `https://api.miftah.xyz/api/stalk/facebook?username=${user}`,
      `https://api.caliph.biz.id/api/stalk/facebook?username=${user}`,
      `https://api.paxsenix.biz.id/api/stalk/facebook?username=${user}`,
      `https://api.yanzbotz.my.id/api/stalk/facebook?username=${user}`,
      `https://api.erdwpe.my.id/api/stalk/facebook?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.name) {
          const output = `┌──⌈ 🕵️ FB AUDIT ⌋
┃
┃ Name: ${d.name}
┃ UID: ${d.id || user}
┃ Gender: ${d.gender || 'N/A'}
┃
├─⊷ Follow: ${d.followers || 'N/A'}
├─⊷ About: ${d.about || 'No bio.'}
├─⊷ Locale: ${d.locale || 'N/A'}
┃
┃ Profile: fb.com/${d.id || user}
┃ Status: RETRIEVED
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.profile_pic || d.avatar || `https://graph.facebook.com/${d.id || user}/picture?type=large` }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Facebook profile not found or private.\n└────────────────`);
  }
};
