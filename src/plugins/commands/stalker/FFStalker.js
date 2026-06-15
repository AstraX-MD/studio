/**
 * @fileOverview Free Fire Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "ffstalker",
  aliases: ["ffstalk", "ffprofile"],
  category: "stalker",
  description: "Audit any Garena Free Fire player ID.",
  usage: "ffstalker <player_id>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const id = args[0];

    if (!id) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Free Fire ID required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/ff_stalk?id=${id}`,
      `https://api.zahwazein.xyz/api/stalk/ff?id=${id}`,
      `https://api.vytmp3.com/ffstalk?id=${id}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.nickname) {
          const output = `┌──⌈ 🕵️ FREEFIRE AUDIT ⌋
┃
┃ Nickname: ${d.nickname}
┃ Player ID: ${id}
┃
├─⊷ Level: ${d.level || 'N/A'}
├─⊷ Exp: ${d.xp?.toLocaleString() || 'N/A'}
├─⊷ Region: ${d.region || 'Global'}
┃
┃ Guild: ${d.guildName || 'None'}
┃ Likes: ${d.likes?.toLocaleString() || '0'}
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.reply(output);
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ FF account not found or API busy.\n└────────────────`);
  }
};
