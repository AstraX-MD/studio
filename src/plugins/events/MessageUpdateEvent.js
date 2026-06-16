/**
 * @fileOverview Anti-Edit: Simple English reports for Owner DM.
 */
export default {
  name: 'messages.update',
  description: 'Track and report edited messages',
  enabled: true,
  async execute(bot, updates) {
    const ownerJid = bot.config.owners[0] + '@s.whatsapp.net';

    for (const update of updates) {
      if (update.update.message) {
        const key = update.key;
        const jid = key.remoteJid;
        if (jid === 'status@broadcast') continue;

        try {
          // Load original from store
          const oldMsg = await bot.client.store.loadMessage(jid, key.id);
          if (!oldMsg) continue;

          const oldText = oldMsg.message?.conversation || oldMsg.message?.extendedTextMessage?.text;
          const newText = update.update.message?.conversation || update.update.message?.extendedTextMessage?.text || 
                          update.update.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation;

          if (!oldText || !newText || oldText === newText) continue;

          const sender = key.participant || jid;
          console.log(`\x1b[35m[WARDEN] Message Edited by @${sender.split('@')[0]} in ${jid}\x1b[0m`);

          const report = `┌──⌈ 🛡️ EDITED ⌋
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
└────────────────`;

          await bot.client.sock.sendMessage(ownerJid, { 
            text: report,
            mentions: [sender]
          }).catch(() => {});

        } catch (e) {}
      }
    }
  }
};