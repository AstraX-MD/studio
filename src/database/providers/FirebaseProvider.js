/**
 * @fileOverview DEPRECATED: Firebase Provider has been removed for AstraX Enterprise portability.
 * Use MongoDB or Local JSON for 100% host compatibility.
 */
export default class FirebaseProvider {
  constructor(bot) {
    this.bot = bot;
  }
  async init() {
    this.bot.logger.error('CRITICAL: Firebase provider is no longer supported. Switching to JSON...');
    throw new Error('Firebase Deprecated');
  }
}