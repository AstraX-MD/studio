/**
 * @fileOverview Generate a QR code from text or URL.
 */
export default {
  name: "qrencode",
  aliases: ["qr", "genqr"],
  category: "tools",
  description: "Generate a high-quality QR code image.",
  usage: "qr <text/url>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const text = args.join(' ');
    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}qr <content>\n└────────────────`);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
    
    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: qrUrl },
      caption: `┌──⌈ 🏁 QR GENERATOR ⌋\n┃ Content: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n┃ Format: PNG (500x500)\n└────────────────`
    }, { quoted: ctx.msg });
  }
};