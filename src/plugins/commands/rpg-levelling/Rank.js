/**
 * @fileOverview Generate a professional RPG Rank Card using SVG & Sharp.
 */
import sharp from 'sharp';

export default {
  name: "rank",
  aliases: ["lvl", "level"],
  category: "rpg-levelling",
  description: "View your current level and XP progress on a visual card.",
  usage: "rank [tag]",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const userId = target.split('@')[0];
    const stats = await ctx.bot.db.get('rpg_stats', userId) || { xp: 0, level: 0 };
    
    // Level Logic: Lvl = floor(sqrt(xp/100))
    const currentLevel = Math.floor(Math.sqrt(stats.xp / 100)) || 0;
    const nextLevelXp = Math.pow(currentLevel + 1, 2) * 100;
    const currentLevelXp = Math.pow(currentLevel, 2) * 100;
    const progress = stats.xp - currentLevelXp;
    const required = nextLevelXp - currentLevelXp;
    const percent = Math.min(100, Math.floor((progress / required) * 100));

    const { key } = await ctx.reply(`┌──⌈ 📋 AUDITING ⌋\n┃ Task: Rank Card\n┃ User: @${userId}\n└────────────────`);

    try {
      const svg = `
      <svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="15" fill="#050406" />
        <rect width="100%" height="100%" rx="15" fill="#9747FF" opacity="0.05" />
        
        <!-- Header -->
        <text x="40" y="50" font-family="Arial" font-size="20" fill="#9747FF" font-weight="bold">${botName.toUpperCase()} RANKING</text>
        
        <!-- User Info -->
        <text x="40" y="110" font-family="Arial" font-size="45" fill="white" font-weight="bold">@${userId}</text>
        
        <!-- Stats -->
        <text x="40" y="160" font-family="Arial" font-size="22" fill="#82A9FF">LEVEL ${currentLevel}</text>
        <text x="760" y="160" font-family="Arial" font-size="18" fill="#888" text-anchor="end">${stats.xp.toLocaleString()} / ${nextLevelXp.toLocaleString()} XP</text>
        
        <!-- Progress Bar Background -->
        <rect x="40" y="180" width="720" height="25" rx="12.5" fill="#1A1A1A" />
        
        <!-- Progress Bar Fill -->
        <rect x="40" y="180" width="${(percent / 100) * 720}" height="25" rx="12.5" fill="#9747FF" />
        
        <text x="400" y="198" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${percent}%</text>
      </svg>`;

      const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: buffer, 
        caption: `┌──⌈ 🛡️ RANK CARD ⌋\n┃ Level: ${currentLevel}\n┃ XP: ${stats.xp.toLocaleString()}\n┃ Status: Active Member\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [target]
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Rank engine failed.\n└────────────────");
    }
  }
};
