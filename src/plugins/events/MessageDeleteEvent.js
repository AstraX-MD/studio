/**
 * @fileOverview Anti-Delete: Simple English reports for Owner DM.
 */
export default {
  name: 'messages.delete',
  description: 'Track and report deleted messages',
  enabled: true,
  async execute(bot, data) {
    const { keys } = data;
    const ownerJid = bot.config.owners[0] + '@s.whatsapp.net';

    for (const key of keys) {
      try {
        const jid = key.remoteJid;
        const sender = key.participant || jid;
        
        // Retrieve deleted content from store
        const msg = await bot.client.store.loadMessage(jid, key.id);
        if (!msg) continue;

        const content = msg.message?.conversation || 
                      msg.message?.extendedTextMessage?.text || 
                      msg.message?.imageMessage?.caption || 
                      'Media/Unsupported Content';

        console.log(`\x1b[35m[WARDEN] Message Deleted by @${sender.split('@')[0]} in ${jid}\x1b[0m`);

        const report = `┌──⌈ 🛡️ DELETED ⌋
┃ 
┃ Sender: @${sender.split('@')[0]}
┃ Chat: ${jid.split('@')[0]}
┃ 
├─⌈ MESSAGE CONTENT ⌋
┃ "${content}"
┃ 
└────────────────`;

        await bot.client.sock.sendMessage(ownerJid, { 
          text: report,
          mentions: [sender]
        }).catch(() => {});

      } catch (e) {}
    }
  }
};