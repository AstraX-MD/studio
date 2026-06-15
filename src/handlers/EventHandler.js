
/**
 * @fileOverview Manages all Baileys socket events.
 */
class EventHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async handle(events) {
    if (events['messages.upsert']) {
      const upsert = events['messages.upsert'];
      for (const msg of upsert.messages) {
        await this.bot.handlers.message.handle(msg);
      }
    }

    // Pass system events to registered event plugins
    for (const [eventName, eventData] of Object.entries(events)) {
      const plugin = this.bot.events.get(eventName);
      if (plugin && typeof plugin.execute === 'function') {
        plugin.execute(this.bot, eventData);
      }
    }
  }
}

export default EventHandler;
