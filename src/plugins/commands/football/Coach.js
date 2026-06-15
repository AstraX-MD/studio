/**
 * @fileOverview Manager/Coach information.
 */
import axios from 'axios';

export default {
  name: "coach",
  aliases: ["manager"],
  category: "football",
  description: "Get details about a football coach/manager.",
  usage: "coach <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_coach?query=${encodeURIComponent(query)}`);
      const c = res.data.data;

      const output = `┌──⌈ 👔 MANAGER INFO ⌋
┃
┃ Name: ${c.name}
┃ Club: ${c.team}
┃ Age: ${c.age} | Country: ${c.country}
┃
├─⊷ Experience: ${c.experience || 'Pro'}
├─⊷ Joined: ${c.joined || 'N/A'}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      await ctx.sock.sendMessage(ctx.jid, { image: { url: c.photo }, caption: output }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Manager not found.\n└────────────────");
    }
  }
};
