/**
 * AstraX - loader.js
 * Recursive plugin scanner with ESM stability.
 */

import { readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { logger } from './logger.js'
import { db } from './db.js'
import { setCommands, setObservers } from './router.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = join(__dirname, '..', 'plugins')
const COMMANDS_DIR = join(PLUGINS_DIR, 'commands')
const OBSERVERS_DIR = join(PLUGINS_DIR, 'observers')

export const commands = new Map()
export const observers = new Map()
export const aliases = new Map()
export const categories = new Map()

function scanFolder(dir) {
  let files = []
  if (!existsSync(dir)) return files
  const items = readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = join(dir, item.name)
    if (item.isDirectory()) {
      files = [...files, ...scanFolder(fullPath)]
    } else if (item.name.endsWith('.js')) {
      files.push(fullPath)
    }
  }
  return files
}

export async function initLoader() {
  commands.clear()
  aliases.clear()
  observers.clear()
  categories.clear()

  const cmdFiles = scanFolder(COMMANDS_DIR)
  for (const file of cmdFiles) {
    try {
      const fileUrl = pathToFileURL(file).href + `?t=${Date.now()}`
      const module = await import(fileUrl)
      const cmd = module.default || module
      if (cmd?.name && cmd?.execute) {
        const name = cmd.name.toLowerCase()
        commands.set(name, cmd)
        
        const relativePath = file.replace(COMMANDS_DIR, '').replace(/^[\/\\]/, '')
        const category = relativePath.split(/[\/\\]/)[0] || 'misc'
        cmd.category = cmd.category || category

        if (Array.isArray(cmd.aliases)) {
          cmd.aliases.forEach(a => aliases.set(a.toLowerCase(), name))
        }

        if (!categories.has(cmd.category)) {
          categories.set(cmd.category, [])
        }
        categories.get(cmd.category).push(cmd.name)

        logger.pluginLoaded(cmd.name, 'COMMAND', commands.size)
      }
    } catch (e) {
      logger.error('LOADER', `Failed ${file}: ${e.message}`)
    }
  }

  const obsFiles = scanFolder(OBSERVERS_DIR)
  for (const file of obsFiles) {
    try {
      const module = await import(pathToFileURL(file).href)
      const obs = module.default || module
      if (obs?.name && obs?.execute) {
        observers.set(obs.name.toLowerCase(), obs)
        logger.pluginLoaded(obs.name, 'OBSERVER', observers.size)
      }
    } catch (e) {}
  }

  setCommands(commands)
  setObservers(observers)
  return { commands: commands.size, observers: observers.size }
}