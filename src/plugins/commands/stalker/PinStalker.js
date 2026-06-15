/**
 * @fileOverview Pinterest Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "pinstalker",
  aliases: ["pinstalk", "pinprofile"],
  category: "stalker",
  description: "Audit any Pinterest user profile.",
  usage: "pinstalker <username>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const user = args[0];

    if (!user) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Pinterest username required.\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/pinterest_stalk?username=${user}`,
      `https://api.zahwazein.xyz/api/stalk/pinterest?username=${user}`,
      `https://api.vytmp3.com/pinstalk?user=${user}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.username) {
          const output = `┌──⌈ 🕵️ PIN AUDIT ⌋
┃
┃ Username: @${d.username}
┃ Full Name: ${d.full_name || 'N/A'}
┃
├─⊷ Follow: ${d.following?.toLocaleString() || 'N/A'}
├─⊷ Fans: ${d.followers?.toLocaleString() || 'N/A'}
├─⊷ Pins: ${d.pin_count?.toLocaleString() || 'N/A'}
┃
┃ Bio: ${d.about || 'No bio.'}
┃ Status: RETRIEVED
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: d.image || d.avatar }, 
            caption: output 
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Pinterest profile not found.\n└────────────────`);
  }
};
