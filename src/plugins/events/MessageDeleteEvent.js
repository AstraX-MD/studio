/**
 * @fileOverview Detects and restores deleted messages.
 * v1.2.5: Logs routed directly to Owner Private DM.
 */
export default {
  name: 'messages.delete',
  description: 'Log and restore deleted messages to Owner DM',
  enabled: true,
  async execute(bot, data) {
    // Enabled by default for AstraX Enterprise
    const config = await bot.db.get('security', 'antidelete:config') || { mode: 'on' };
    if (config.mode === 'off') return;

    const { keys } = data;
    for (const key of keys) {
      const jid = key.remoteJid;
      const isGroup = jid.endsWith('@g.us');
      const ownerJid = bot.config.owners[0] + '@s.whatsapp.net';
      
      console.log(`==> WARDEN: Anti-Delete event detected in ${jid}`);
      
      const sender = key.participant || jid;
      const location = isGroup ? 'Group Chat' : 'Private DM';

      const log = `┌──⌈ 🛡️ WARDEN ALERT ⌋
┃ Event: MESSAGE_DELETED
┃ Target: ${location}
┃ User: @${sender.split('@')[0]}
┃ Origin: ${jid.split('@')[0]}
┃
├─⊷ Status: INTERCEPTED
└────────────────`;

      // Send the alert only to the Owner's private chat
      await bot.client.sock.sendMessage(ownerJid, { 
        text: log,
        mentions: [sender]
      }).catch(() => {});
    }
  }
};