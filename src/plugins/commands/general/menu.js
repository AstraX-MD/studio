/**
 * AstraX - menu.js
 * Master Command Directory
 * Simple English, Mobile-First, Performance Stats
 */

import os from 'os';
import { commands } from '../../../core/loader.js';

export default {
  name: "menu",
  aliases: ["help", "commands"],
  category: "general",
  description: "Display the main command menu and system stats.",
  execute: async (sock, m, args, ctx) => {
    const { prefix, sender, db } = ctx;
    const botName = await db.get('botname') || 'AstraX';
    const owner = await db.get('owner') || 'Not Set';
    const dbMode = db.mode || 'RAM';
    
    // RAM Progress Bar Calculation
    const mem = process.memoryUsage();
    const ramUsed = (mem.heapUsed / 1024 / 1024).toFixed(0);
    const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(0);
    const percent = Math.min(100, Math.floor((mem.heapUsed / mem.heapTotal) * 100));
    const barCount = Math.floor(percent / 10);
    const ramBar = '■'.repeat(barCount) + '□'.repeat(10 - barCount);

    // Group commands by category
    const categories = {};
    const uniqueCommands = new Set();
    
    commands.forEach((cmd) => {
      if (uniqueCommands.has(cmd.name)) return;
      uniqueCommands.add(cmd.name);
      
      const cat = cmd.category || 'misc';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.name);
    });

    const totalCmds = uniqueCommands.size;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const pushName = m.pushName || 'User';

    let menu = `┌──⌈ 🌌 ${botName.toUpperCase()} ⌋
┃ 👤 User: @${sender.split('@')[0]}
┃ 🏷️ Name: ${pushName}
┃ 
├─⌈ SYSTEM STATS ⌋
┃ ⏱️ Time: ${time}
┃ 🛰️ Platform: Render
┃ 🔑 Prefix: [ ${prefix} ]
┃ 👑 Owner: ${owner}
┃ 📦 Mode: ${dbMode.toUpperCase()}
┃ 🧠 RAM: [${ramBar}] ${percent}%
┃ 🛠️ Tools: ${totalCmds} Modules
┃\n`;

    // Display Categories and Commands
    const sortedCats = Object.keys(categories).sort();
    sortedCats.forEach(cat => {
      menu += `├─⌈ ${cat.toUpperCase()} ⌋\n`;
      menu += `┃ ${categories[cat].map(n => prefix + n).join(', ')}\n┃\n`;
    });

    menu += `└─ ${botName} Enterprise`;

    await sock.sendMessage(m.key.remoteJid, { 
      text: menu,
      mentions: [sender]
    }, { quoted: m });
  }
};
