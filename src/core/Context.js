
/**
 * @fileOverview Creates a simplified interface for message interaction.
 */
class Context {
  constructor(bot, msg) {
    this.bot = bot;
    this.msg = msg;
    this.sock = bot.client.sock;
    
    this.jid = msg.key.remoteJid;
    this.fromMe = msg.key.fromMe;
    this.pushName = msg.pushName || 'User';
    this.sender = this.jid.endsWith('@g.us') ? msg.key.participant : this.jid;
    
    this.text = msg.message?.conversation || 
                msg.message?.extendedTextMessage?.text || 
                msg.message?.imageMessage?.caption || 
                msg.message?.videoMessage?.caption || '';
                
    this.isGroup = this.jid.endsWith('@g.us');
  }

  async reply(text, options = {}) {
    return await this.sock.sendMessage(this.jid, { text }, { quoted: this.msg, ...options });
  }

  async sendText(text, options = {}) {
    return await this.sock.sendMessage(this.jid, { text }, options);
  }

  async react(emoji) {
    return await this.sock.sendMessage(this.jid, {
      react: { text: emoji, key: this.msg.key }
    });
  }
}

export default Context;
