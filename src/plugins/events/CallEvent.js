/**
 * @fileOverview Handles incoming WhatsApp calls with Auto-Reject support.
 * v1.2.5: Removed legacy logger to prevent crashes.
 */
export default {
  name: 'call',
  description: 'Manage incoming calls (Auto-Reject/Log)',
  enabled: true,
  async execute(bot, calls) {
    for (const call of calls) {
      if (call.status === 'offer') {
        console.log(`==> SECURITY: Incoming call from: ${call.from}`);
        
        const config = await bot.db.get('automation', 'call:reject:config');
        const isGroup = call.from.endsWith('@g.us');
        
        const shouldReject = config?.mode === 'both' || 
                            (config?.mode === 'dm' && !isGroup) || 
                            (config?.mode === 'groups' && isGroup);

        if (shouldReject) {
          await bot.client.sock.rejectCall(call.id, call.from);
          
          await bot.client.sock.sendMessage(call.from, { 
            text: `┌──⌈ 📞 SYSTEM ⌋\n┃ Incoming calls are disabled.\n┃ Status: Auto-Rejected\n└────────────────` 
          }).catch(() => {});
        }
      }
    }
  }
};
