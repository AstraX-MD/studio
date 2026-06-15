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
    console.log(`\n==> ASTRAX: Booting Core Intelligence...`);
    
    await this.db.init();
    await this._checkExpiration();

    await CommandLoader.load(this);
    await EventLoader.load(this);
    await PluginLoader.load(this);

    await this.client.connect();
    
    this.isReady = true;
    console.log('==> ASTRAX: Core Subsystems Synchronized.\n');
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
        category: cmd.category
      });
    }
    return manifest;
  }

  async _checkExpiration() {
    const expireDays = parseInt(process.env.EXPIRE_DAYS);
    if (!expireDays) return;

    let deployDate = await this.db.get('core', 'deployment_date');
    if (!deployDate) {
      deployDate = Date.now();
      await this.db.set('core', 'deployment_date', deployDate);
    }

    const expiryTime = deployDate + (expireDays * 24 * 60 * 60 * 1000);
    const now = Date.now();

    if (now > expiryTime) {
      console.log('\n====================================');
      console.log('  DEPLOYMENT EXPIRED: ACCESS BLOCKED');
      console.log('====================================\n');
      process.exit(1);
    }

    const remainingDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
    console.log(`==> SUBSCRIPTION: Active (${remainingDays} days remaining)`);
  }
}

export default new Bot();