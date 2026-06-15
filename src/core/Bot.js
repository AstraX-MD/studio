
/**
 * @fileOverview The main orchestrator for the AstraX framework.
 * Coordinates between the client, database, and loaders.
 */
import Client from './Client.js';
import CommandLoader from '../loaders/CommandLoader.js';
import EventLoader from '../loaders/EventLoader.js';
import PluginLoader from '../loaders/PluginLoader.js';
import MessageHandler from '../handlers/MessageHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import pino from 'pino';

class Bot {
  constructor() {
    this.logger = pino({ level: 'info' });
    this.client = new Client(this);
    this.commands = new Map();
    this.events = new Map();
    this.plugins = new Map();
    this.isReady = false;
    
    this.handlers = {
      message: new MessageHandler(this),
      event: new EventHandler(this)
    };
  }

  async init() {
    this.logger.info('Initializing AstraX Core...');
    
    // Loaders will register commands/events into the Maps
    await CommandLoader.load(this);
    await EventLoader.load(this);
    await PluginLoader.load(this);

    await this.client.connect();
    this.isReady = true;
    this.logger.info('AstraX Core is Online.');
  }
}

export default new Bot();
