/**
 * @fileOverview Mobile Legends Profile Stalker.
 */
import axios from 'axios';

export default {
  name: "mlstalker",
  aliases: ["mlstalk", "mlprofile"],
  category: "stalker",
  description: "Audit any Mobile Legends (MLBB) player ID.",
  usage: "mlstalker <id> <zone>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const id = args[0];
    const zone = args[1];

    if (!id || !zone) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Usage: mlstalker 12345 6789\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/ml_stalk?id=${id}&zone=${zone}`,
      `https://api.zahwazein.xyz/api/stalk/ml?id=${id}&zone=${zone}`,
      `https://api.vytmp3.com/mlstalk?id=${id}&zone=${zone}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const d = res.data.data || res.data.result || res.data;

        if (d && d.userName) {
          const output = `┌──⌈ 🕵️ MLBB AUDIT ⌋
┃
┃ Username: ${d.userName}
┃ User ID: ${id}
┃ Zone ID: ${zone}
┃
├─⊷ Rank: ${d.rank || 'N/A'}
├─⊷ Level: ${d.level || 'N/A'}
├─⊷ Region: ${d.region || 'Global'}
┃
┃ Status: VERIFIED
┃ Node: Cloud-Audit
┃
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.reply(output);
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ MLBB account not found. Check ID/Zone.\n└────────────────`);
  }
};
