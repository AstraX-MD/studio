/**
 * @fileOverview Generate a visual bank statement image using SVG.
 */
import sharp from 'sharp';

export default {
  name: "bankstatement",
  aliases: ["statement", "receipt"],
  category: "economy",
  description: "Get a visual receipt of your bank account status.",
  usage: "bankstatement",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0 };
    
    await ctx.reply(`┌──⌈ 🏦 BANKING ⌋\n┃ Status: Printing Statement...\n└────────────────`);

    try {
      const svg = `
      <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white" />
        <text x="300" y="80" font-family="Courier" font-size="40" fill="black" text-anchor="middle" font-weight="bold">ASTRAX CENTRAL BANK</text>
        <text x="300" y="110" font-family="Courier" font-size="16" fill="black" text-anchor="middle">Official Transaction Record</text>
        
        <text x="50" y="180" font-family="Courier" font-size="18" fill="black">DATE: ${new Date().toLocaleDateString()}</text>
        <text x="50" y="210" font-family="Courier" font-size="18" fill="black">USER: @${userId}</text>
        
        <path d="M 50 240 L 550 240" stroke="black" stroke-dasharray="5,5" />
        
        <text x="50" y="300" font-family="Courier" font-size="24" fill="black">WALLET FUNDS</text>
        <text x="550" y="300" font-family="Courier" font-size="24" fill="black" text-anchor="end">$${economy.wallet.toLocaleString()}</text>
        
        <text x="50" y="350" font-family="Courier" font-size="24" fill="black">BANK SAVINGS</text>
        <text x="550" y="350" font-family="Courier" font-size="24" fill="black" text-anchor="end">$${economy.bank.toLocaleString()}</text>
        
        <path d="M 50 400 L 550 400" stroke="black" stroke-width="2" />
        
        <text x="50" y="450" font-family="Courier" font-size="30" fill="black" font-weight="bold">TOTAL ASSETS</text>
        <text x="550" y="450" font-family="Courier" font-size="30" fill="black" text-anchor="end" font-weight="bold">$${(economy.wallet + economy.bank).toLocaleString()}</text>
        
        <text x="300" y="550" font-family="Courier" font-size="14" fill="black" text-anchor="middle">AUTHORIZED BY ${botName.toUpperCase()}</text>
      </svg>`;

      const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: buffer, 
        caption: `┌──⌈ 📄 BANK RECEIPT ⌋\n┃ Status: Certified\n└─ 🌌 ${botName.toUpperCase()}` 
      }, { quoted: ctx.msg });

    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Receipt printer jammed.\n└────────────────");
    }
  }
};
