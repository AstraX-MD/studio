/**
 * @fileOverview High-speed Remote Pairing Utility.
 * Generates a WhatsApp Pairing Code and QR Image for device linking.
 */
import QRCode from 'qrcode';

export default {
  name: "pair",
  aliases: ["linkdevice", "getcode", "session"],
  category: "general",
  description: "Generate a WhatsApp Pairing Code and QR for a phone number.",
  usage: "pair <phone_number>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const phoneNumber = args[0]?.replace(/[^0-9]/g, '');

    if (!phoneNumber || phoneNumber.length < 10) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Provide a valid phone number.\n┃ Example: ${prefix}pair 254123456789\n└────────────────`);
    }

    const { key: loadingKey } = await ctx.reply(`┌──⌈ 🛰️ PAIRING HUB ⌋\n┃ Status: Requesting Code...\n┃ Target: +${phoneNumber}\n└────────────────`);

    try {
      // 1. Request the Pairing Code from Baileys
      const code = await ctx.bot.client.getPairingCode(phoneNumber);

      // 2. Generate a QR Code buffer for the code string
      const qrBuffer = await QRCode.toBuffer(code, {
        margin: 2,
        scale: 10,
        color: {
          dark: '#9747FF', // AstraX Primary
          light: '#FFFFFF'
        }
      });

      // 3. Send the QR Code Image
      await ctx.sock.sendMessage(ctx.jid, {
        image: qrBuffer,
        caption: `┌──⌈ 📱 DEVICE LINK ⌋
┃ 
┃ Target: +${phoneNumber}
┃ Status: CODE GENERATED
┃ 
┃ Scan this or use the code
┃ sent in the next message.
└────────────────
  © ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      // 4. Send the Code (Copy-Friendly Monospace)
      await ctx.sock.sendMessage(ctx.jid, {
        text: `*${code}*`
      });

      // 5. Send Instructions
      const instructions = `┌──⌈ 📖 INSTRUCTIONS ⌋
┃
┃ 1. Open WhatsApp on the target phone.
┃ 2. Go to Settings > Linked Devices.
┃ 3. Select 'Link with phone number instead'.
┃ 4. Enter the code: *${code}*
┃
┃ Status: WAITING FOR LINK...
└────────────────`;

      await ctx.sock.sendMessage(ctx.jid, { text: instructions, edit: loadingKey });

    } catch (e) {
      ctx.bot.logger.error(`Pairing Command Error: ${e.message}`);
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch pairing code.\n┃ Reason: Connection Busy.\n└────────────────`);
    }
  }
};
