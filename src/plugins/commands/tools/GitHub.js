/**
 * @fileOverview Search for GitHub user profiles.
 */
import axios from 'axios';

export default {
  name: "github",
  aliases: ["gituser", "gh"],
  category: "tools",
  description: "Fetch details of a GitHub user profile.",
  usage: "github <username>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const user = args[0];
    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}github xbotmanager-cell\n└────────────────`);

    try {
      const res = await axios.get(`https://api.github.com/users/${user}`);
      const d = res.data;

      const output = `┌──⌈ 👨‍💻 GITHUB USER ⌋
┃ Name: ${d.name || 'N/A'}
┃ Bio: ${d.bio || 'N/A'}
┃ Public Repos: ${d.public_repos}
┃ Followers: ${d.followers}
┃ Following: ${d.following}
┃ Company: ${d.company || 'N/A'}
┃ Location: ${d.location || 'N/A'}
┃ URL: ${d.html_url}
└────────────────`;
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: d.avatar_url },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ GitHub user not found.\n└────────────────`);
    }
  }
};