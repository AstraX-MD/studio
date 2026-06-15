/**
 * @fileOverview Spotify Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "spotistalker",
  aliases: ["spotistalk", "spotifyprofile"],
  category: "stalker",
  description: "Audit any Spotify user profile.",
  usage: "spotistalker <username/uid>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Spotify ID required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/spotify_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/spotify?username=${user}`,
      `https://api.vytmp3.com/spotistalk?user=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.display_name) {
          const output = `┌──⌈ 🕵️ SPOTIFY AUDIT ⌋
┃
┃ Display: ${d.display_name}
┃ Type: ${d.type.toUpperCase()}
┃
├─⊷ Fans: ${d.followers?.total?.toLocaleString() || 'N/A'}
├─⊷ Country: ${d.country || 'N/A'}
├─⊷ Product: ${d.product?.toUpperCase() || 'FREE'}
┃
┃ Profile: ${d.external_urls?.spotify || 'N/A'}
┃ Status: RETRIEVED
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.images?.[0]?.url || d.avatar || 'https://i.ibb.co/L9H86vG/spotify.png' }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Spotify profile not found or private.\n└────────────────`);
  }
};
