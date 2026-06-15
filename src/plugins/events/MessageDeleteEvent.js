/**
 * @fileOverview Handles message deletion (Anti-Delete support).
 */
export default {
  name: 'message.delete',
  description: 'Detects and logs deleted messages',
  enabled: true,
  async execute(bot, data) {
    bot.logger.info('A message was deleted by a user.');
    // Logic for Anti-Delete module
  }
};
