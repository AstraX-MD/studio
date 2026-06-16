/**
 * AstraX - menu.js
 * Master Command Directory
 * High-Speed, Visual RAM, Mobile-First.
 */

export default {
  name: "menu",
  aliases: ["help", "commands"],
  category: "utility",
  description: "Display the main command menu and system stats.",
  execute: async (sock, m, args, { db, logger, prefix }) => {
    const sender = m.key.participant || m.key.remoteJid
    const pushName = m.pushName || 'User'
    
    // RAM Progress Bar Calculation
    const mem = process.memoryUsage()
    const percent = Math.min(100, Math.floor((mem.heapUsed / mem.heapTotal) * 100))
    const barCount = Math.floor(percent / 10)
    const ramBar = '■'.repeat(barCount) + '□'.repeat(10 - barCount)

    const categories = {
      'admin': [],
      'ai-chat': [],
      'ai-image': [],
      'ai-video': [],
      'ai-music': [],
      'economy': [],
      'downloaders': [],
      'logos': [],
      'reactions': [],
      'tools': [],
      'security': [],
      'utility': []
    }
    
    // Total registered command objects
    const commands = await import('../../../system/loader.js').then(m => m.commands)
    commands.forEach((cmd) => {
      const cat = cmd.category || 'utility'
      if (categories[cat]) categories[cat].push(cmd.name)
    })

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    let menu = `┌──⌈ 🌌 ASTRAX ⌋
┃ 👤 User: @${sender.split('@')[0]}
┃ 🏷️ Name: ${pushName}
┃ 
├─⌈ SYSTEM STATS ⌋
┃ ⏱️ Time: ${time}
┃ 🛰️ Platform: Render
┃ 🔑 Prefix: [ ${prefix} ]
┃ 📦 Mode: ${db.mode.toUpperCase()}
┃ 🧠 RAM: [${ramBar}] ${percent}%
┃ 🛠️ Tools: ${commands.size} Modules
┃\n`

    Object.keys(categories).forEach(cat => {
      if (categories[cat].length > 0) {
        menu += `├─⌈ ${cat.toUpperCase()} ⌋\n`
        menu += `┃ ${categories[cat].sort().map(n => prefix + n).join(', ')}\n┃\n`
      }
    })

    menu += `└─ AstraX Enterprise`

    await sock.sendMessage(m.key.remoteJid, { 
      text: menu,
      mentions: [sender]
    }, { quoted: m })
  }
}