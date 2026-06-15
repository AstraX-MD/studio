/**
 * @fileOverview Detects and restores deleted messages.
 * v1.2.5: Fixed logger crash.
 */
export default {
  name: 'messages.delete',
  description: 'Log and restore deleted messages',
  enabled: true,
  async execute(bot, data) {
    const config = await bot.db.get('security', 'antidelete:config');
    if (!config || config.mode === 'off') return;

    const { keys } = data;
    for (const key of keys) {
      const jid = key.remoteJid;
      const isGroup = jid.endsWith('@g.us');
      
      const shouldLog = config.mode === 'both' || 
                        (config.mode === 'dm' && !isGroup) || 
                        (config.mode === 'groups' && isGroup);

      if (shouldLog) {
        console.log(`==> WARDEN: Anti-Delete triggered in ${jid}`);
        await bot.client.sock.sendMessage(jid, { 
          text: `┌──⌈ 🛡️ WARDEN ⌋\n┃ Task: Anti-Delete\n┃ Event: Message Deleted\n┃ User: @${key.participant?.split('@')[0] || jid.split('@')[0]}\n└────────────────`,
          mentions: [key.participant || jid]
        }).catch(() => {});
      }
    }
  }
};
