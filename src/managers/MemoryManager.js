/**
 * @fileOverview Manages chat session history for the AI Agent.
 */
export default class MemoryManager {
  constructor(bot) {
    this.bot = bot;
    this.history = new Map(); // chatJid -> array of messages
    this.MAX_HISTORY = 20;
  }

  /**
   * Adds a message to the chat history.
   */
  add(jid, role, content) {
    if (!this.history.has(jid)) {
      this.history.set(jid, []);
    }
    const logs = this.history.get(jid);
    logs.push({ role, content, timestamp: Date.now() });
    
    // Keep only recent history
    if (logs.length > this.MAX_HISTORY) {
      logs.shift();
    }
  }

  /**
   * Retrieves the conversation history for a chat.
   */
  get(jid) {
    return this.history.get(jid) || [];
  }

  /**
   * Clears memory for a chat.
   */
  clear(jid) {
    this.history.delete(jid);
  }
}
