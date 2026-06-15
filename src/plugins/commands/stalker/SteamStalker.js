/**
 * @fileOverview Steam Profile Stalker with 10+ redundant APIs.
 */
import axios from 'axios';

export default {
  name: "steamstalker",
  aliases: ["steamstalk", "steamp"],
  category: "stalker",
  description: "Audit any Steam gaming profile.",
  usage: "steamstalker <vanity_url/uid>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Steam ID/URL required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/steam_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/steam?username=${user}`,
      `https://api.vytmp3.com/steamstalk?user=${user}`,
      `https://api.miftah.xyz/api/stalk/steam?username=${user}`,
      `https://api.caliph.biz.id/api/stalk/steam?username=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.personaname) {
          const output = `┌──⌈ 🕵️ STEAM AUDIT ⌋
┃
┃ Persona: ${d.personaname}
┃ Real Name: ${d.realname || 'N/A'}
┃
├─⊷ Level: ${d.level || 'N/A'}
├─⊷ Games: ${d.game_count || 'N/A'}
├─⊷ Country: ${d.loccountrycode || 'N/A'}
┃
┃ Status: ${d.personastate === 1 ? '🟢 Online' : '⚪ Offline'}
┃ Account ID: ${d.steamid}
┃ Joined: ${new Date(d.timecreated * 1000).toLocaleDateString()}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.avatarfull }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Steam profile not found.\n└────────────────`);
  }
};
