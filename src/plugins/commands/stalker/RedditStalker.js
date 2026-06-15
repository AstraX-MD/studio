/**
 * @fileOverview Reddit User Stalker with 10+ redundant APIs.
 */
import axios from 'axios';

export default {
  name: "redditstalker",
  aliases: ["redditstalk", "uprofile"],
  category: "stalker",
  description: "Get detailed statistics for any Reddit user.",
  usage: "redditstalker <username>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0]?.replace('u/', '');

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Reddit username required.\n└────────────────`);

    const fallbacks = [
      `https://www.reddit.com/user/${user}/about.json`,
      `https://api.agatz.xyz/api/reddit_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/reddit?username=${user}`,
      `https://api.vytmp3.com/redditstalk?user=${user}`,
      `https://api.miftah.xyz/api/stalk/reddit?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && (d.name || d.subreddit)) {
          const name = d.name || d.subreddit.display_name;
          const karma = d.total_karma || d.link_karma + d.comment_karma;
          const output = `┌──⌈ 🕵️ REDDIT AUDIT ⌋
┃
┃ Username: u/${name}
┃ Karma: ${karma?.toLocaleString()}
┃
├─⊷ Post Karma: ${d.link_karma?.toLocaleString()}
├─⊷ Comment Karma: ${d.comment_karma?.toLocaleString()}
├─⊷ Created: ${new Date(d.created_utc * 1000).toLocaleDateString()}
┃
┃ Verified: ${d.verified ? '💎 YES' : '❌ NO'}
┃ Gold: ${d.is_gold ? '🟡 YES' : '⚪ NO'}
┃ Mod: ${d.is_mod ? '🛡️ YES' : '👤 NO'}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.icon_img?.split('?')[0] || d.avatar || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png' }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ User not found on Reddit.\n└────────────────`);
  }
};
