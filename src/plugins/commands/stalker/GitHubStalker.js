/**
 * @fileOverview High-performance GitHub Stalker with vertical Slate-Box styling.
 */
import axios from 'axios';

export default {
  name: "ghstalker",
  aliases: ["gitstalk", "ghp"],
  category: "stalker",
  description: "Retrieve comprehensive developer data from GitHub profiles.",
  usage: "ghstalker <username>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ GitHub handle missing.\n└────────────────");

    const fallbacks = [
      `https://api.github.com/users/${user}`,
      `https://api.agatz.xyz/api/github_stalk?username=${user}`,
      `https://api.vytmp3.com/github?user=${user}`,
      `https://api.dlow.xyz/api/github?q=${user}`,
      `https://api.xyter.com/github?user=${user}`,
      `https://api.zahwazein.xyz/api/stalk/github?username=${user}`,
      `https://api.paxsenix.biz.id/api/stalk/github?username=${user}`,
      `https://api.caliph.biz.id/api/stalk/github?username=${user}`,
      `https://api.miftah.xyz/api/stalk/github?username=${user}`,
      `https://api.yanzbotz.my.id/api/stalk/github?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data;

        if (d && d.login) {
          const output = `┌──⌈ 🕵️ DEV AUDIT ⌋
┃
┃ Handle: @${d.login}
┃ Identity: ${d.name || 'Anonymous'}
┃
├─⊷ Repos: ${d.public_repos}
├─⊷ Gists: ${d.public_gists}
├─⊷ Fans: ${d.followers}
├─⊷ Flow: ${d.following}
┃
┃ Bio: ${d.bio || 'No bio.'}
┃ Org: ${d.company || 'Independent'}
┃ Loc: ${d.location || 'Distributed'}
┃ Joined: ${new Date(d.created_at).toLocaleDateString()}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.avatar_url }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Developer profile not found.\n└────────────────");
  }
};
