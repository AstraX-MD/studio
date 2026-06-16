/**
 * AstraX - system/db.js
 * Auto-detects MongoDB or falls back to RAM mode
 * All settings are real-time — no restart needed
 * FULLY ADAPTIVE - accepts any DB keys
 */

import { MongoClient } from 'mongodb'

export const DEFAULTS = {
  prefix: '!',
  botname: 'AstraX',
  botimage: 'https://i.ibb.co/QvGY7dqB/file-00000000e1107243ad54749c06fe2d80.png',
  owner: '',
  mode: 'public',
  autoRead: false,
  autoTyping: false,
  autoRecording: false,
  antiLink: false,
  disabledCmds: []
}

class RamStore {
  constructor () {
    this._data = { ...DEFAULTS }
    this._groups = new Map()
    this._users = new Map()
  }

  async get (key) {
    return this._data.hasOwnProperty(key) ? this._data[key] : null
  }

  async set (key, value) {
    this._data[key] = value
    return true
  }

  async delete (key) {
    delete this._data[key]
    return true
  }

  async getGroupKey (jid, key) {
    const group = this._groups.get(jid) || {}
    return group[key] || null
  }

  async setGroup (jid, key, value) {
    const current = this._groups.get(jid) || {}
    current[key] = value
    this._groups.set(jid, current)
    return true
  }

  get mode () { return 'ram' }
}

class MongoStore {
  constructor (client, dbName = 'astrax') {
    this._db = client.db(dbName)
    this._settings = this._db.collection('settings')
    this._groups = this._db.collection('groups')
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

  async getGroupKey (jid, key) {
    const doc = await this._groups.findOne({ jid })
    return doc?.settings?.[key] || null
  }

  async setGroup (jid, key, value) {
    await this._groups.updateOne({ jid }, { $set: { [`settings.${key}`]: value } }, { upsert: true })
    return true
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
    } catch (err) {
      _store = new RamStore()
    }
  } else {
    _store = new RamStore()
  }
  return _store
}

export const db = {
  get mode () { return _store?.mode || 'uninitialized' },
  async get (key) { return _store.get(key) },
  async set (key, value) { return _store.set(key, value) },
  async delete (key) { return _store.delete(key) },
  async getGroupKey (jid, key) { return _store.getGroupKey(jid, key) },
  async setGroup (jid, key, value) { return _store.setGroup(jid, key, value) }
}