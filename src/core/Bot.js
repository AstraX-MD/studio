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
    
    // 1. Init Database
    await this.db.init();

    // 2. Deployment Expiration Check
    await this._checkExpiration();

    // 3. Load Modules
    await CommandLoader.load(this);
    await EventLoader.load(this);
    await PluginLoader.load(this);

    // 4. Connect to WhatsApp
    await this.client.connect();
    
    this.isReady = true;
    this.logger.info('AstraX Core is Online.');
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
      this.logger.error('CRITICAL: Deployment subscription expired. Shutting down...');
      console.log('\n====================================');
      console.log('  DEPLOYMENT EXPIRED: SUBSCRIPTION ENDED');
      console.log('====================================\n');
      process.exit(1);
    }

    const remainingDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
    this.logger.info(`Subscription Status: ACTIVE (${remainingDays} days remaining)`);
  }
}

export default new Bot();