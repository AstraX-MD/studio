/**
 * @fileOverview Fun/Casual SimSimi Chat.
 */
import axios from 'axios';

export default {
  name: "simsimi",
  aliases: ["simi"],
  category: "ai-chat",
  description: "Chat with the classic, funny, and sometimes rude SimSimi.",
  usage: "simi <message>",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx, args) => {
    const msg = args.join(' ');
    if (!msg) return ctx.reply("Say something to Simi!");

    const fallbacks = [
      `https://api.agatz.xyz/api/simsimi?message=${encodeURIComponent(msg)}`,
      `https://api.vytmp3.com/simi?query=${encodeURIComponent(msg)}`,
      `https://api.simsimi.net/v2/?text=${encodeURIComponent(msg)}&lc=en`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const ans = res.data.data || res.data.result || res.data.success;
        if (ans) return ctx.reply(`🐥 Simi: ${ans}`);
      } catch (e) { continue; }
    }
    ctx.reply("🐥 Simi is sleeping.");
  }
};
