/**
 * @fileOverview Warden: Anti-Edit System.
 * Sends before/after content to Owner DM in Simple English.
 */
export default {
  name: 'messages.update',
  description: 'Capture edited messages and report to owner',
  enabled: true,
  async execute(bot, updates) {
    const ownerJid = bot.config.owners[0] + '@s.whatsapp.net';

    for (const update of updates) {
      if (update.update.message) {
        const key = update.key;
        const jid = key.remoteJid;
        if (jid === 'status@broadcast') continue;

        try {
          const oldMsg = await bot.client.store.loadMessage(jid, key.id);
          if (!oldMsg) continue;

          const oldText = oldMsg.message?.conversation || oldMsg.message?.extendedTextMessage?.text;
          const newText = update.update.message?.conversation || 
                          update.update.message?.extendedTextMessage?.text ||
                          update.update.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation;

          if (!oldText || !newText || oldText === newText) continue;

          const sender = key.participant || jid;
          console.log(`\x1b[35m[WARDEN] Message Edited in ${jid.split('@')[0]}\x1b[0m`);

          const report = `┌──⌈ 🛡️ ANTI-EDIT ⌋
┃ 
┃ User: @${sender.split('@')[0]}
┃ Chat: ${jid.split('@')[0]}
┃ 
├─⌈ OLD MESSAGE ⌋
┃ "${oldText}"
┃ 
├─⌈ NEW MESSAGE ⌋
┃ "${newText}"
┃ 
└─ AstraX Warden`;

          await bot.client.sock.sendMessage(ownerJid, { 
            text: report,
            mentions: [sender]
          });

        } catch (e) {}
      }
    }
  }
};
