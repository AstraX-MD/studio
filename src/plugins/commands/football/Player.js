/**
 * @fileOverview Player statistics and details.
 */
import axios from 'axios';

export default {
  name: "player",
  category: "football",
  description: "Fetch detailed statistics for any football player.",
  usage: "player <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Player name required.\n└────────────────");

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_player?query=${encodeURIComponent(query)}`);
      const p = res.data.data;

      const output = `┌──⌈ 🏃 PLAYER AUDIT ⌋
┃
┃ Name: ${p.name}
┃ Nationality: ${p.country}
┃ Age: ${p.age} | Position: ${p.position}
┃
├─⊷ Club: ${p.team}
├─⊷ Goals: ${p.goals || 0}
├─⊷ Assists: ${p.assists || 0}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      await ctx.sock.sendMessage(ctx.jid, { image: { url: p.photo }, caption: output }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Player profile not found.\n└────────────────");
    }
  }
};
