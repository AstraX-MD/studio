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
import MemoryManager from '../managers/MemoryManager.js';
import config from '../configs/default.js';

class Bot {
  constructor() {
    this.config = config;
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
  }

  async init() {
    console.log(`\n┌──⌈ 🌌 ASTRAX ENTERPRISE ⌋`);
    console.log(`┃ Version: 1.2.5-STABLE`);
    console.log(`┃ Status: INITIALIZING...`);
    console.log(`└─────────────────────────`);
    
    try {
      await this.db.init();

      await CommandLoader.load(this);
      await EventLoader.load(this);
      await PluginLoader.load(this);

      await this.client.connect();
      
      this.isReady = true;
      
      const prefix = await this.managers.settings.get('core', 'prefix') || '!';
      console.log(`\n┌──⌈ ⚙️ SYSTEM READY ⌋`);
      console.log(`┃ Prefix: [ ${prefix} ]`);
      console.log(`┃ Modules: ${this.commands.size} Active`);
      console.log(`┃ Events: ${this.events.size} Active`);
      console.log(`┃ Status: LISTENING...`);
      console.log(`└─────────────────────\n`);
    } catch (error) {
      console.log(`\n==> CRITICAL: Boot sequence failed: ${error.message}\n`);
    }
  }

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