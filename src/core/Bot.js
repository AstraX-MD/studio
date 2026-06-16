/**
 * @fileOverview AstraX Orchestrator with Master Dashboard API.
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
import MemoryManager from '../managers/MemoryManager.js';
import config from '../configs/default.js';
import { logger } from './logger.js';

class Bot {
  constructor() {
    this.config = config;
    this.config.version = '1.2.5';
    this.client = new Client(this);
    this.db = new DatabaseManager(this);
    
    this.commands = new Map();
    this.events = new Map();
    this.plugins = new Map();
    
    this.managers = {
      roles: new RoleManager(this),
      settings: new SettingsManager(this),
      memory: new MemoryManager(this)
    };

    this.handlers = {
      message: new MessageHandler(this),
      event: new EventHandler(this)
    };
    
    this.isReady = false;
    this.io = null; 
  }

  async init() {
    logger.banner(
      this.config.name, 
      this.config.prefix, 
      this.config.owners[0] || 'Not Set', 
      this.db.activeProviderName,
      '6.7.22'
    );
    
    try {
      await this.db.init();
      logger.success('CORE', 'Database connected.');

      await CommandLoader.load(this);
      await EventLoader.load(this);
      await PluginLoader.load(this);

      await this.client.connect();
      
      this.isReady = true;
      logger.ramStats();
      
    } catch (error) {
      logger.error('BOOT', `Startup failed: ${error.message}`);
    }
  }

  /**
   * Provides data for Dashboard
   */
  getCommandManifest() {
    const manifest = [];
    const seen = new Set();
    for (const cmd of this.commands.values()) {
      if (seen.has(cmd.name)) continue;
      seen.add(cmd.name);
      manifest.push({
        name: cmd.name,
        description: cmd.description,
        usage: cmd.usage,
        category: cmd.category,
        aliases: cmd.aliases || []
      });
    }
    return manifest;
  }
}

export default new Bot();
