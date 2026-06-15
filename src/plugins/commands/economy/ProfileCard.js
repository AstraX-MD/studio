/**
 * @fileOverview Generate a high-end SVG Profile Card using Sharp.
 */
import sharp from 'sharp';

export default {
  name: "profilecard",
  aliases: ["pcard", "card"],
  category: "economy",
  description: "Generate a professional image card of your social and financial stats.",
  usage: "profilecard",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0 };
    const role = await ctx.bot.managers.roles.getRole(ctx.sender);
    
    const { key } = await ctx.reply(`┌──⌈ 🖼️ GENERATING ⌋\n┃ Task: Profile Card\n┃ Engine: SVG/Sharp\n└────────────────`);

    try {
      const svg = `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" rx="20" fill="url(#grad)" />
        <circle cx="100" cy="100" r="60" fill="#9747FF" opacity="0.3" />
        <text x="40" y="60" font-family="Arial" font-size="24" fill="#9747FF" font-weight="bold">${botName.toUpperCase()} PASSPORT</text>
        <text x="40" y="150" font-family="Arial" font-size="40" fill="white" font-weight="bold">@${userId}</text>
        <text x="40" y="200" font-family="Arial" font-size="20" fill="#82A9FF">Rank: ${role >= 9 ? 'OWNER' : 'USER'}</text>
        
        <rect x="40" y="250" width="720" height="2" fill="white" opacity="0.1" />
        
        <text x="40" y="300" font-family="Arial" font-size="18" fill="#888">WALLET BALANCE</text>
        <text x="40" y="330" font-family="Arial" font-size="32" fill="white" font-weight="bold">$${economy.wallet.toLocaleString()}</text>
        
        <text x="400" y="300" font-family="Arial" font-size="18" fill="#888">BANK BALANCE</text>
        <text x="400" y="330" font-family="Arial" font-size="32" fill="white" font-weight="bold">$${economy.bank.toLocaleString()}</text>
      </svg>`;

      const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: buffer, 
        caption: `┌──⌈ 🪪 SOCIAL CARD ⌋\n┃ Identity: Verified\n┃ Status: Active\n└─ 🌌 ${botName.toUpperCase()}` 
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Rendering failed.\n└────────────────");
    }
  }
};
