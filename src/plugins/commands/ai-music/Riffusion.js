/**
 * @fileOverview Riffusion AI Real-time Melody Generator.
 */
import axios from 'axios';

export default {
  name: "riffusion",
  aliases: ["beat", "melody"],
  category: "ai-music",
  description: "Generate unique melodies and beats from text.",
  usage: "riffusion <style>",
  cooldown: 30,
  permissions: 1,
  execute: async (ctx, args) => {
    const style = args.join(' ');
    try {
      const res = await axios.get(`https://api.agatz.xyz/api/riffusion?text=${encodeURIComponent(style)}`);
      await ctx.sock.sendMessage(ctx.jid, { 
        audio: { url: res.data.data },
        mimetype: 'audio/mp4',
        caption: `┌──⌈ 🎶 RIFF GEN ⌋\n┃ Style: ${style}\n└─ AstraX System`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("Beat machine failed.");
    }
  }
};