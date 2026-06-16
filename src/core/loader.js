/**
 * AstraX - loader.js
 * Auto-loads all plugins from plugins/commands and plugins/observers
 * Zero hardcode — scans folders dynamically
 * Hot-reload support — no restart needed for new plugins
 */

import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { logger } from './logger.js'
import { db } from './db.js'
import { setCommands, setObservers } from './router.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const commands = new Map()
export const observers = new Map()
export const categories = new Map()
export const aliases = new Map()

const PLUGINS_DIR = join(__dirname, '..', 'plugins')
const COMMANDS_DIR = join(PLUGINS_DIR, 'commands')
const OBSERVERS_DIR = join(PLUGINS_DIR, 'observers')

function scanFolder(dir, ext = '.js') {
  const files = []
  if (!existsSync(dir)) return files
  try {
    const items = readdirSync(dir, { withFileTypes: true })
    for (const item of items) {
      const fullPath = join(dir, item.name)
      if (item.isDirectory()) {
        files.push(...scanFolder(fullPath, ext))
      } else if (item.isFile() && item.name.endsWith(ext)) {
        files.push(fullPath)
      }
    }
  } catch (e) {
    logger.warn('LOADER', `Failed to scan ${dir}`, e.message)
  }
  return files
}

function validateCommand(cmd, filePath) {
  if (!cmd || typeof cmd !== 'object') return false
  if (!cmd.name || typeof cmd.name !== 'string') return false
  if (!cmd.execute || typeof cmd.execute !== 'function') return false
  return true
}

function validateObserver(obs, filePath) {
  if (!obs || typeof obs !== 'object') return false
  if (!obs.name || typeof obs.name !== 'string') return false
  if (!obs.execute || typeof obs.execute !== 'function') return false
  return true
}

async function loadCommands() {
  commands.clear()
  aliases.clear()
  categories.clear()

  const files = scanFolder(COMMANDS_DIR)
  for (const file of files) {
    try {
      const fileUrl = pathToFileURL(file).href
      const cacheBuster = `${fileUrl}?t=${Date.now()}`
      const module = await import(cacheBuster)
      let cmd = module.default || module

      if (cmd.init && typeof cmd.init === 'function') {
        const dynamic = await cmd.init({ db, categories })
        cmd = {...cmd, ...dynamic}
      }

      if (!validateCommand(cmd, file)) continue

      const relativePath = file.replace(COMMANDS_DIR, '').replace(/^[\/\\]/, '')
      const parts = relativePath.split(/[\/\\]/)
      const category = parts.length > 1 ? parts[0] : 'misc'

      cmd.category = cmd.category || category
      cmd.file = file
      
      commands.set(cmd.name.toLowerCase(), cmd)

      if (Array.isArray(cmd.aliases)) {
        cmd.aliases.forEach(a => aliases.set(a.toLowerCase(), cmd.name.toLowerCase()))
      }

      if (!categories.has(cmd.category)) {
        categories.set(cmd.category, { name: cmd.category, commands: [] })
      }
      categories.get(cmd.category).commands.push(cmd)
      logger.pluginLoaded(cmd.name, 'COMMAND', commands.size)
    } catch (e) {
      logger.error('LOADER', `Failed ${file}: ${e.message}`)
    }
  }
}

async function loadObservers() {
  observers.clear()
  const files = scanFolder(OBSERVERS_DIR)
  for (const file of files) {
    try {
      const fileUrl = pathToFileURL(file).href
      const module = await import(`${fileUrl}?t=${Date.now()}`)
      const obs = module.default || module

      if (!validateObserver(obs, file)) continue
      observers.set(obs.name.toLowerCase(), obs)
      logger.pluginLoaded(obs.name, 'OBSERVER', observers.size)
    } catch (e) {}
  }
}

export async function initLoader() {
  logger.info('LOADER', 'Initializing plugin swarm...')
  await loadCommands()
  await loadObservers()
  setCommands(commands)
  setObservers(observers)
  return { commands: commands.size, observers: observers.size }
}
