/**
 * @fileOverview Warden: Anti-Delete System.
 * Sends original content to Owner DM in Simple English.
 */
export default {
  name: 'messages.delete',
  description: 'Capture deleted messages and report to owner',
  enabled: true,
  async execute(bot, data) {
    const { keys } = data;
    const ownerJid = bot.config.owners[0] + '@s.whatsapp.net';

    for (const key of keys) {
      try {
        const jid = key.remoteJid;
        const sender = key.participant || jid;
        
        // Load from Baileys store (Must be bound in Client.js)
        const msg = await bot.client.store.loadMessage(jid, key.id);
        if (!msg) continue;

        const content = msg.message?.conversation || 
                      msg.message?.extendedTextMessage?.text || 
                      msg.message?.imageMessage?.caption || 
                      'Media Content';

        console.log(`\x1b[35m[WARDEN] Message Deleted in ${jid.split('@')[0]}\x1b[0m`);

        const report = `┌──⌈ 🛡️ ANTI-DELETE ⌋
┃ 
┃ User: @${sender.split('@')[0]}
┃ Chat: ${jid.split('@')[0]}
┃ 
├─⌈ ORIGINAL MESSAGE ⌋
┃ "${content}"
┃ 
└─ AstraX Warden`;

        await bot.client.sock.sendMessage(ownerJid, { 
          text: report,
          mentions: [sender]
        });

      } catch (e) {}
    }
  }
};
