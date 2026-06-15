/**
 * @fileOverview PlayStation Network Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "psnstalker",
  aliases: ["psnstalk", "playstation"],
  category: "stalker",
  description: "Audit any PSN (PlayStation) online ID.",
  usage: "psnstalker <online_id>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ PSN ID required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/psn_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/psn?username=${user}`,
      `https://api.vytmp3.com/psnstalk?user=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.onlineId) {
          const output = `┌──⌈ 🕵️ PSN AUDIT ⌋
┃
┃ ID: ${d.onlineId}
┃ Account: ${d.accountId || 'N/A'}
┃
├─⊷ Trophies: ${d.trophySummary?.level || 'N/A'}
├─⊷ Platinum: ${d.trophySummary?.earnedTrophies?.platinum || 0}
├─⊷ Gold: ${d.trophySummary?.earnedTrophies?.gold || 0}
┃
┃ Region: ${d.region || 'Global'}
┃ Status: ACTIVE
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.avatarUrl || d.avatar }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ PSN profile not found or private.\n└────────────────`);
  }
};
