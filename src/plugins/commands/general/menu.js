/**
 * AstraX - menu.js
 * Master Command Directory — WolfBot Style
 * Vertical Listing | Real-time Stats | Image Support
 */

import os from 'os';
import { commands } from '../../../../system/loader.js';

export default {
  name: "menu",
  aliases: ["help", "commands", "h"],
  category: "utility",
  description: "Display the premium vertical command menu.",
  execute: async (sock, m, args, { db, prefix, pushName, sender }) => {
    try {
      // 1. Fetch System Stats
      const uptimeRaw = process.uptime();
      const hours = Math.floor(uptimeRaw / 3600);
      const mins = Math.floor((uptimeRaw % 3600) / 60);
      const secs = Math.floor(uptimeRaw % 60);
      const uptime = `${hours}h ${mins}m ${secs}s`;

      const mem = process.memoryUsage();
      const usedMem = (mem.heapUsed / 1024 / 1024).toFixed(1);
      const totalMem = (os.totalmem() / 1024 / 1024).toFixed(1);
      const ramPercent = Math.min(100, Math.floor((mem.heapUsed / mem.heapTotal) * 100));
      
      // Construct RAM Bar
      const barFull = Math.floor(ramPercent / 10);
      const ramBar = '█'.repeat(barFull) + '░'.repeat(10 - barFull);

      const platform = process.env.RENDER ? "🚀 Render" : os.platform() === 'linux' ? "🐧 Linux" : "💻 Local";
      const botName = await db.get('botname') || "ASTRAX";
      const owner = await db.get('owner') || "AstraRoot";
      const mode = await db.get('mode') || "Public";
      const time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Dar_es_Salaam' });

      // 2. Organize Commands by Category
      const categories = {};
      const uniqueCmds = new Set();
      
      commands.forEach((cmd) => {
        if (!uniqueCmds.has(cmd.name)) {
          uniqueCmds.add(cmd.name);
          const cat = (cmd.category || 'misc').toUpperCase();
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(cmd.name);
        }
      });

      // 3. Construct Menu Header
      let menuText = `Hello 👋 @${sender.split('@')[0]}\n\n`;
      menuText += `┌──⌈ \`${botName.toUpperCase()}\` ⌋\n`;
      menuText += `┃ User: ▣ ${pushName}\n`;
      menuText += `┃ Owner: ${owner}\n`;
      menuText += `┃ Mode: 🌍 ${mode.charAt(0).toUpperCase() + mode.slice(1)}\n`;
      menuText += `┃ Prefix: [ ${prefix} ]\n`;
      menuText += `┃ Version: 1.2.5\n`;
      menuText += `┃ Platform: ${platform}\n`;
      menuText += `┃ Status: Active\n`;
      menuText += `┃ Time: ${time}\n`;
      menuText += `┃ Uptime: ${uptime}\n`;
      menuText += `┃ RAM: ${ramBar} ${ramPercent}%\n`;
      menuText += `┃ Memory: ${usedMem}MB / ${totalMem}MB\n`;
      menuText += `└────────────────\n\n`;

      // 4. Construct Vertical Category Blocks
      const sortedCategories = Object.keys(categories).sort();
      
      for (const cat of sortedCategories) {
        menuText += `┌──⌈ \`${cat}\` ⌋\n`;
        const sortedCmds = categories[cat].sort();
        for (const cmd of sortedCmds) {
          menuText += `│ ${cmd}\n`;
        }
        menuText += `└───────────────\n\n`;
      }

      menuText += `*Total Modules:* ${uniqueCmds.size}\n`;
      menuText += `© ${botName} Enterprise`;

      // 5. Send with Bot Image
      const botImage = await db.get('botimage') || 'https://i.ibb.co/QvGY7dqB/file-00000e1107243ad54749c06fe2d80.png';

      await sock.sendMessage(m.key.remoteJid, {
        image: { url: botImage },
        caption: menuText,
        mentions: [sender]
      }, { quoted: m });

    } catch (e) {
      console.error('Menu Error:', e);
      await sock.sendMessage(m.key.remoteJid, { text: `❌ Failed to load menu: ${e.message}` }, { quoted: m });
    }
  }
};
