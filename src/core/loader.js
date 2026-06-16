/**
 * @fileOverview AstraX System Loader.
 * Safely extracts Baileys functions and loads commands into the orchestrator.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import baileys from '@whiskeysockets/baileys';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * DEFENSIVE FUNCTION DISCOVERY
 * Probes the Baileys package for functions to prevent ESM resolution crashes.
 */
function probe(pkg, name) {
  const source = pkg?.default || pkg;
  if (source && source[name]) return source[name];
  if (typeof source === 'function' && name === 'makeWASocket') return source;
  if (source && typeof source === 'object') {
    const keys = Object.keys(source);
    const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (match) return source[match];
  }
  return null;
}

export async function initializeSystem(bot) {
  logger.info('LOAD', 'Initiating Swarm for Baileys core...');

  // Safe extraction of Baileys modules
  const makeWASocket = probe(baileys, 'makeWASocket');
  const useMultiFileAuthState = probe(baileys, 'useMultiFileAuthState');
  const makeInMemoryStore = probe(baileys, 'makeInMemoryStore');
  const DisconnectReason = probe(baileys, 'DisconnectReason');
  const Browsers = probe(baileys, 'Browsers');

  if (!useMultiFileAuthState || !makeWASocket) {
    throw new Error('CRITICAL: Could not resolve Baileys core functions.');
  }

  return { 
    makeWASocket, 
    useMultiFileAuthState, 
    makeInMemoryStore, 
    DisconnectReason,
    Browsers
  };
}