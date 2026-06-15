/**
 * @fileOverview Roblox Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "robloxstalker",
  aliases: ["robloxstalk", "robloxprofile"],
  category: "stalker",
  description: "Audit any Roblox user profile.",
  usage: "robloxstalker <username/uid>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Roblox username required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/roblox_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/roblox?username=${user}`,
      `https://api.vytmp3.com/robloxstalk?user=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.name) {
          const output = `┌──⌈ 🕵️ ROBLOX AUDIT ⌋
┃
┃ Name: ${d.name}
┃ Display: ${d.displayName || 'N/A'}
┃
├─⊷ Friends: ${d.friendCount?.toLocaleString() || 'N/A'}
├─⊷ Fans: ${d.followerCount?.toLocaleString() || 'N/A'}
├─⊷ Flow: ${d.followingCount?.toLocaleString() || 'N/A'}
┃
┃ Bio: ${d.description || 'No bio.'}
┃ UID: ${d.id}
┃ Joined: ${new Date(d.created).toLocaleDateString()}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.headshotUrl || d.avatar }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Roblox user not found.\n└────────────────`);
  }
};
