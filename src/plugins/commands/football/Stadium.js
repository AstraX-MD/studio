/**
 * @fileOverview Stadium information.
 */
import axios from 'axios';

export default {
  name: "stadium",
  category: "football",
  description: "Get details about a football stadium.",
  usage: "stadium <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_stadium?query=${encodeURIComponent(query)}`);
      const s = res.data.data;

      const output = `┌──⌈ 🏟️ STADIUM AUDIT ⌋
┃
┃ Name: ${s.name}
┃ City: ${s.city}
┃ Capacity: ${s.capacity?.toLocaleString()}
┃
├─⊷ Surface: ${s.surface || 'Grass'}
├─⊷ Opened: ${s.opened || 'N/A'}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      await ctx.sock.sendMessage(ctx.jid, { image: { url: s.image }, caption: output }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Stadium not found.\n└────────────────");
    }
  }
};
