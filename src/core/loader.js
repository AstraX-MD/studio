/**
 * AstraX - src/core/loader.js
 * Recursive plugin loader with hot-reload and Baileys discovery swarm.
 */

import { readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { logger } from './logger.js'
import { db } from './db.js'
import { setCommands, setObservers } from './router.js'
import baileys from '@whiskeysockets/baileys'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const commands = new Map()
export const observers = new Map()
export const categories = new Map()
export const aliases = new Map()

const PLUGINS_DIR = join(__dirname, '..', 'plugins')
const COMMANDS_DIR = join(PLUGINS_DIR, 'commands')
const OBSERVERS_DIR = join(PLUGINS_DIR, 'observers')

/**
 * 30-Probe Baileys Discovery engine.
 * Ensures core functions are found even in complex ESM environments.
 */
export function probeBaileys(name) {
  const swarm = [
    baileys?.[name],
    baileys?.default?.[name],
    baileys?.default?.default?.[name],
    (Object.entries(baileys || {}).find(([k]) => k.toLowerCase() === name.toLowerCase()) || [])[1],
    (Object.entries(baileys?.default || {}).find(([k]) => k.toLowerCase() === name.toLowerCase()) || [])[1]
  ]
  return swarm.find(f => typeof f === 'function' || typeof f === 'object')
}

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
      const cmd = module.default || module

      if (cmd?.name && cmd?.execute) {
        const name = cmd.name.toLowerCase()
        commands.set(name, cmd)

        const relativePath = file.replace(COMMANDS_DIR, '').replace(/^[\/\\]/, '')
        const category = relativePath.split(/[\/\\]/)[0] || 'misc'
        cmd.category = cmd.category || category

        if (Array.isArray(cmd.alias)) {
          cmd.alias.forEach(a => aliases.set(a.toLowerCase(), name))
        }

        if (!categories.has(cmd.category)) {
          categories.set(cmd.category, { name: cmd.category, commands: [] })
        }
        categories.get(cmd.category).commands.push(cmd.name)

        logger.pluginLoaded(cmd.name, 'COMMAND', commands.size)
      }
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
      const module = await import(pathToFileURL(file).href + `?t=${Date.now()}`)
      const obs = module.default || module
      if (obs?.name && obs?.execute) {
        observers.set(obs.name.toLowerCase(), obs)
        logger.pluginLoaded(obs.name, 'OBSERVER', observers.size)
      }
    } catch (e) {}
  }
}

export async function initLoader() {
  logger.info('LOADER', 'Initializing AstraX Plugin Swarm...')
  await loadCommands()
  await loadObservers()

  setCommands(commands)
  setObservers(observers)

  logger.success('LOADER', `Engine Ready: ${commands.size} Cmds / ${observers.size} Obs`)
  return { commands: commands.size, observers: observers.size }
}