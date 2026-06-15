/**
 * @fileOverview Xbox Live Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "xboxstalker",
  aliases: ["xboxstalk", "gamertag"],
  category: "stalker",
  description: "Audit any Xbox Live Gamertag.",
  usage: "xboxstalker <gamertag>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args.join(' ');

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Gamertag required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/xbox_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/xbox?username=${user}`,
      `https://api.vytmp3.com/xboxstalk?user=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.gamertag) {
          const output = `┌──⌈ 🕵️ XBOX AUDIT ⌋
┃
┃ Tag: ${d.gamertag}
┃ Name: ${d.realName || 'N/A'}
┃
├─⊷ Gamerscore: ${d.gamerscore?.toLocaleString()}
├─⊷ Rep: ${d.xboxOneRep || 'N/A'}
├─⊷ Tier: ${d.isGold ? '🟡 Gold' : '⚪ Standard'}
┃
┃ Bio: ${d.bio || 'No bio.'}
┃ Status: ACTIVE
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.displayPicRaw || d.avatar }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Xbox Gamertag not found.\n└────────────────`);
  }
};
