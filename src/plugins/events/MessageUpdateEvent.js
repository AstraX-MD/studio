/**
 * @fileOverview Detects and logs message edits.
 * v1.2.5: Logs routed directly to Owner Private DM.
 */
export default {
  name: 'messages.update',
  description: 'Detect message edits and log to Owner DM',
  enabled: true,
  async execute(bot, updates) {
    // Enabled by default for AstraX Enterprise
    const config = await bot.db.get('security', 'antiedit:config') || { mode: 'on' };
    if (config.mode === 'off') return;

    for (const update of updates) {
      // 68 is editedMessage stub type in some versions, or check editedMessage property
      if (update.update.messageStubType === 68 || update.update.editedMessage || update.update.message) {
        const jid = update.key.remoteJid;
        if (jid === 'status@broadcast') continue;
        
        const isGroup = jid.endsWith('@g.us');
        const ownerJid = bot.config.owners[0] + '@s.whatsapp.net';
        const sender = update.key.participant || jid;

        console.log(`==> WARDEN: Anti-Edit event detected in ${jid}`);

        const log = `┌──⌈ 🛡️ WARDEN ALERT ⌋
┃ Event: MESSAGE_EDITED
┃ Target: ${isGroup ? 'Group' : 'DM'}
┃ User: @${sender.split('@')[0]}
┃ Origin: ${jid.split('@')[0]}
┃
├─⊷ Status: LOGGED
└────────────────`;

        // Send alert to Owner DM
        await bot.client.sock.sendMessage(ownerJid, { 
          text: log,
          mentions: [sender]
        }).catch(() => {});
      }
    }
  }
};