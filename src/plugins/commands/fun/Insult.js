/**
 * @fileOverview Generate high-tier insults with 10+ fallbacks.
 */
import axios from 'axios';

export default {
  name: "insult",
  aliases: ["roast", "burn"],
  category: "fun",
  description: "Generate a witty or evil insult.",
  usage: "insult <tag>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mention = target ? `@${target.split('@')[0]} ` : "";

    const fallbacks = [
      'https://evilinsult.com/generate_insult.php?lang=en&type=json',
      'https://insult.mattbas.org/api/insult.json',
      'https://api.agatz.xyz/api/insult',
      'https://api.vytmp3.com/insult'
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const insult = res.data.insult || res.data.result || res.data.data;
        if (insult) {
          const output = `┌──⌈ 💢 INSULT ⌋
┃ 
┃ ${mention}${insult}
┃
└─ 🌌 ${botName.toUpperCase()}`;
          return await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: target ? [target] : [] });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Roast machine is cold.\n└────────────────");
  }
};
