/**
 * @fileOverview Team profile and information.
 */
import axios from 'axios';

export default {
  name: "team",
  category: "football",
  description: "Get detailed information about a football club.",
  usage: "team <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Club name required.\n└────────────────");

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_team?query=${encodeURIComponent(query)}`);
      const t = res.data.data;

      const output = `┌──⌈ 🛡️ CLUB PROFILE ⌋
┃
┃ Name: ${t.name}
┃ Country: ${t.country}
┃ Founded: ${t.founded || 'N/A'}
┃ Stadium: ${t.stadium || 'N/A'}
┃
├─⊷ Capacity: ${t.capacity || 'N/A'}
├─⊷ Coach: ${t.coach || 'N/A'}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      await ctx.sock.sendMessage(ctx.jid, { image: { url: t.logo }, caption: output }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Club not found.\n└────────────────");
    }
  }
};
