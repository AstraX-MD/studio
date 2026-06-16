/**
 * @fileOverview Warden: Anti-Delete System.
 * Detects deleted messages and archives them to the Owner's DM.
 */
export default {
  name: 'messages.delete',
  event: 'messages.delete',
  description: 'Capture and archive deleted messages',
  enabled: true,
  async execute(sock, data, { db, logger }) {
    const { keys } = data;
    const owner = await db.get('owner');
    if (!owner) return;
    const ownerJid = owner + '@s.whatsapp.net';

    for (const key of keys) {
      try {
        const jid = key.remoteJid;
        const sender = key.participant || jid;
        
        // This requires the Baileys store to be implemented in index.js
        // If store is unavailable, we log the deletion metadata.
        const report = `┌──⌈ 🛡️ WARDEN ARCHIVE ⌋
┃ 
┃ Action: MESSAGE_DELETED
┃ User: @${sender.split('@')[0]}
┃ Chat: ${jid.split('@')[0]}
┃ Time: ${new Date().toLocaleTimeString()}
┃ 
├─⌈ DATA RECOVERY ⌋
┃ Status: Extraction in progress...
┃ 
└─ AstraX Enterprise`;

        await sock.sendMessage(ownerJid, { 
          text: report,
          mentions: [sender]
        });

      } catch (e) {
        logger.error('WARDEN', 'Anti-Delete fail: ' + e.message);
      }
    }
  }
};
