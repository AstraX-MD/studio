/**
 * @fileOverview Handles incoming WhatsApp calls.
 */
export default {
  name: 'call',
  description: 'Manage incoming calls (Auto-Reject/Log)',
  enabled: true,
  async execute(bot, calls) {
    for (const call of calls) {
      if (call.status === 'offer') {
        bot.logger.info(`Incoming call from: ${call.from}`);
        
        // Example: Auto-reject if configured (Logic would check database settings)
        // await bot.client.sock.rejectCall(call.id, call.from);
      }
    }
  }
};
