/**
 * AstraX - system/db.js
 * Auto-detects MongoDB or falls back to RAM mode
 * All settings are real-time — no restart needed
 * FULLY ADAPTIVE - accepts any DB keys
 */

import { MongoClient } from 'mongodb'

export const DEFAULTS = {
  prefix: '?',
  botname: 'AstraX',
  botimage: 'https://i.ibb.co/QvGY7dqB/file-00000e1107243ad54749c06fe2d80.png',
  language: 'en',
  theme: 'default',
  owner: '',
  ownerName: 'Owner',
  mode: 'public',
  noPrefix: false,
  boxStyle: '1',
  channelEnabled: true,
  channelJid: '120363426850850275@newsletter',
  channelLink: 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
  channelName: 'AstraX Updates',
  channelForwardScore: 430,
  agentEnabled: false,
  agentApi: null,
  agentModel: 'llama3-70b-8192',
  autoRead: false,
  autoTyping: false,
  autoRecording: false,
  autoStatusView: false,
  antiLink: false,
  antiBadWord: false,
  antiSpam: false,
  antiDelete: false,
  welcomeMsg: true,
  goodbyeMsg: true,
  sudoUsers: [],
  disabledCmds: [],
  badWords: [],
  economyEnabled: false,
  xpEnabled: false,
  eco_currency: '$',
  eco_startbonus: 500,
  eco_daily_amount: 1000,
  eco_rob_cooldown: 3600000,
}

class RamStore {
  constructor () {
    this._data = { ...DEFAULTS }
    this._groups = new Map()
    this._users = new Map()
  }
  async get (key) { return this._data.hasOwnProperty(key) ? this._data[key] : null }
  async set (key, value) { this._data[key] = value; return true }
  async delete (key) { delete this._data[key]; return true }
  async getAll () { return { ...this._data } }
  async getGroup (jid) { return this._groups.get(jid) || {} }
  async setGroup (jid, key, value) {
    const current = this._groups.get(jid) || {}
    current[key] = value
    this._groups.set(jid, current)
    return true
  }
  async getGroupKey (jid, key) {
    const group = this._groups.get(jid) || {}
    return group[key] || null
  }
  async getUser (jid) { return this._users.get(jid) || { xp: 0, coins: 0, level: 1, warnings: 0 } }
  async setUser (jid, key, value) {
    const current = this._users.get(jid) || { xp: 0, coins: 0, level: 1, warnings: 0 }
    current[key] = value
    this._users.set(jid, current)
    return true
  }
  get mode () { return 'ram' }
}

class MongoStore {
  constructor (client, dbName = 'astrax') {
    this._db = client.db(dbName)
    this._settings = this._db.collection('settings')
    this._groups = this._db.collection('groups')
    this._users = this._db.collection('users')
  }
  async _init () {
    const count = await this._settings.countDocuments()
    if (count === 0) {
      const entries = Object.entries(DEFAULTS).map(([key, value]) => ({ key, value }))
      await this._settings.insertMany(entries)
    }
  }
  async get (key) {
    const doc = await this._settings.findOne({ key })
    return doc ? doc.value : null
  }
  async set (key, value) {
    await this._settings.updateOne({ key }, { $set: { key, value } }, { upsert: true })
    return true
  }
  async delete (key) {
    await this._settings.deleteOne({ key })
    return true
  }
  async getGroup (jid) {
    const doc = await this._groups.findOne({ jid })
    return doc?.settings || {}
  }
  async setGroup (jid, key, value) {
    await this._groups.updateOne({ jid }, { $set: { [`settings.${key}`]: value } }, { upsert: true })
    return true
  }
  async getGroupKey (jid, key) {
    const group = await this.getGroup(jid)
    return group[key] || null
  }
  get mode () { return 'mongodb' }
}

let _store = null

export async function initDb () {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || null
  if (mongoUrl) {
    try {
      const client = new MongoClient(mongoUrl)
      await client.connect()
      const store = new MongoStore(client)
      await store._init()
      _store = store
      return store
    } catch (err) { _store = new RamStore() }
  } else { _store = new RamStore() }
  return _store
}

export const db = {
  get mode () { return _store?.mode || 'uninitialized' },
  async get (key) { return _store.get(key) },
  async set (key, value) { return _store.set(key, value) },
  async delete (key) { return _store.delete(key) },
  async getGroupKey (jid, key) { return _store.getGroupKey(jid, key) },
  async setGroup (jid, key, value) { return _store.setGroup(jid, key, value) },
  async getWithDefault (key, defaultValue = null) {
    const value = await this.get(key)
    return value !== null ? value : defaultValue
  }
}