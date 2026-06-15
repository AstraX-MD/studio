/**
 * @fileOverview The main orchestrator for the AstraX framework.
 */
import Client from './Client.js';
import CommandLoader from '../loaders/CommandLoader.js';
import EventLoader from '../loaders/EventLoader.js';
import PluginLoader from '../loaders/PluginLoader.js';
import MessageHandler from '../handlers/MessageHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import DatabaseManager from '../database/DatabaseManager.js';
import RoleManager from '../managers/RoleManager.js';
import SettingsManager from '../managers/SettingsManager.js';
import config from '../configs/default.js';
import pino from 'pino';

class Bot {
  constructor() {
    this.logger = pino({ level: 'info' });
    this.config = config;
    this.client = new Client(this);
    this.db = new DatabaseManager(this);
    
    this.commands = new Map();
    this.events = new Map();
    this.plugins = new Map();
    
    // Core Managers
    this.managers = {
      roles: new RoleManager(this),
      settings: new SettingsManager(this)
    };

    // Central Handlers
    this.handlers = {
      message: new MessageHandler(this),
      event: new EventHandler(this)
    };
    
    this.isReady = false;
  }

  async init() {
    this.logger.info('Initializing AstraX Core...');
    
    // 1. Init Database first as managers depend on it
    await this.db.init();

    // 2. Load Modules (Commands, Events, Plugins)
    await CommandLoader.load(this);
    await EventLoader.load(this);
    await PluginLoader.load(this);

    // 3. Connect to WhatsApp
    await this.client.connect();
    
    this.isReady = true;
    this.logger.info('AstraX Core is Online.');
  }
}

export default new Bot();
