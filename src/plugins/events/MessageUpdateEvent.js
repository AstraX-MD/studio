/**
 * @fileOverview Detects and logs message edits.
 * v1.2.5: Fixed logger crash.
 */
export default {
  name: 'messages.update',
  description: 'Detect message edits and log original content',
  enabled: true,
  async execute(bot, updates) {
    const config = await bot.db.get('security', 'antiedit:config');
    if (!config || config.mode === 'off') return;

    for (const update of updates) {
      if (update.update.messageStubType === 68 || update.update.editedMessage) {
        const jid = update.key.remoteJid;
        const isGroup = jid.endsWith('@g.us');

        const shouldLog = config.mode === 'both' || 
                          (config.mode === 'dm' && !isGroup) || 
                          (config.mode === 'groups' && isGroup);

        if (shouldLog) {
          console.log(`==> WARDEN: Anti-Edit triggered in ${jid}`);
          await bot.client.sock.sendMessage(jid, { 
            text: `┌──⌈ 🛡️ WARDEN ⌋\n┃ Task: Anti-Edit\n┃ Event: Message Modified\n┃ User: @${update.key.participant?.split('@')[0] || jid.split('@')[0]}\n└────────────────`,
            mentions: [update.key.participant || jid]
          }).catch(() => {});
        }
      }
    }
  }
};
