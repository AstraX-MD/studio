/**
 * @fileOverview Fetch today's football matches.
 */
import axios from 'axios';

export default {
  name: "matches",
  aliases: ["fixtures", "todaymatches"],
  category: "football",
  description: "Get a list of today's football matches.",
  usage: "matches",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const { key } = await ctx.reply(`┌──⌈ ⚽ SEARCHING ⌋\n┃ Querying Global Fixtures...\n└────────────────`);

    const fallbacks = [
      'https://api.agatz.xyz/api/football_matches',
      'https://api.vytmp3.com/football/today',
      'https://api.dlow.xyz/api/football/fixtures'
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const matches = res.data.data || res.data.result;
        
        if (matches && matches.length > 0) {
          let output = `┌──⌈ 📅 TODAY'S MATCHES ⌋\n┃\n`;
          matches.slice(0, 15).forEach((m, i) => {
            output += `├─ ${i + 1}. ${m.homeTeam} vs ${m.awayTeam}\n┃    🕒 Time: ${m.time || 'N/A'}\n┃    🏆 ${m.league || 'Unknown'}\n┃\n`;
          });
          output += `└─ 🌌 ${botName.toUpperCase()}`;
          return await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ No matches found for today.\n└────────────────`);
  }
};
