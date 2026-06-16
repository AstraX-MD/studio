/**
 * @fileOverview Warden: Anti-Delete System.
 * Sends original content to Owner DM in simple English.
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
        
        const msg = await bot.client.store.loadMessage(jid, key.id);
        if (!msg) continue;

        const content = msg.message?.conversation || 
                      msg.message?.extendedTextMessage?.text || 
                      msg.message?.imageMessage?.caption || 
                      'Media Content';

        console.log(`\x1b[35m[WARDEN] Message Deleted by @${sender.split('@')[0]}\x1b[0m`);

        const report = `┌──⌈ 🛡️ DELETED ⌋
┃ 
┃ User: @${sender.split('@')[0]}
┃ Chat: ${jid.split('@')[0]}
┃ 
├─⌈ ORIGINAL CONTENT ⌋
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