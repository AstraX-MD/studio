/**
 * @fileOverview Detects and restores deleted messages (Anti-Delete).
 */
export default {
  name: 'messages.delete',
  description: 'Log and restore deleted messages',
  enabled: true,
  async execute(bot, data) {
    const config = await bot.db.get('security', 'antidelete:config');
    if (!config || config.mode === 'off') return;

    // Baileys provides keys of deleted messages
    const { keys } = data;
    for (const key of keys) {
      const jid = key.remoteJid;
      const isGroup = jid.endsWith('@g.us');
      
      const shouldLog = config.mode === 'both' || 
                        (config.mode === 'dm' && !isGroup) || 
                        (config.mode === 'groups' && isGroup);

      if (shouldLog) {
        bot.logger.info(`Restoring deleted message in: ${jid}`);
        // In a production scenario, you would fetch from a local message store
        // For MVP, we send a detection alert
        await bot.client.sock.sendMessage(jid, { 
          text: `┌──⌈ 🛡️ WARDEN ⌋\n┃ Task: Anti-Delete\n┃ Event: Message Deleted\n┃ Target: @${key.participant?.split('@')[0] || jid.split('@')[0]}\n└────────────────`,
          mentions: [key.participant || jid]
        }).catch(() => {});
      }
    }
  }
};
