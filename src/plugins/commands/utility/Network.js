/**
 * @fileOverview Network Interface Audit.
 */
import os from 'os';
import axios from 'axios';

export default {
  name: "network",
  aliases: ["net", "ip"],
  category: "utility",
  description: "Check network interfaces and external IP metadata.",
  usage: "network",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    try {
      const res = await axios.get('https://api.ipify.org?format=json');
      const extIp = res.data.ip;

      const output = `┌──⌈ 🌐 NET AUDIT ⌋
┃ 
┃ External IP: ${extIp}
┃ Node Latency: STABLE
┃ 
├─⊷ Interfaces: ${Object.keys(os.networkInterfaces()).length}
├─⊷ Status: ONLINE
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Network probe failed.\n└────────────────");
    }
  }
};
