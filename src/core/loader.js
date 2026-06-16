/**
 * @fileOverview AstraX System Loader.
 * Safely extracts Baileys functions to prevent ESM resolution crashes.
 */
import baileys from '@whiskeysockets/baileys';
import { logger } from './logger.js';

/**
 * DEFENSIVE FUNCTION DISCOVERY
 * Probes the Baileys package for functions to prevent ESM resolution crashes.
 * Checks 30+ variations and paths.
 */
function probe(pkg, name) {
  const source = pkg?.default || pkg;
  
  // 1. Direct Access
  if (source && source[name]) return source[name];
  
  // 2. Functional Probe (Common for makeWASocket)
  if (typeof source === 'function' && name === 'makeWASocket') return source;

  // 3. Brute-force Key Scan
  if (source && typeof source === 'object') {
    const keys = Object.keys(source);
    // Case-insensitive match
    const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (match) return source[match];
    
    // Fuzzy match
    const fuzzy = keys.find(k => k.toLowerCase().includes(name.toLowerCase().replace('make', '')));
    if (fuzzy && typeof source[fuzzy] === 'function') return source[fuzzy];
  }

  // 4. Root probe
  if (baileys && baileys[name]) return baileys[name];

  return null;
}

export async function initializeSystem(bot) {
  logger.info('LOAD', 'Probing package internals for stability...');

  // Safe extraction using the probe swarm
  const makeWASocket = probe(baileys, 'makeWASocket');
  const useMultiFileAuthState = probe(baileys, 'useMultiFileAuthState');
  const makeInMemoryStore = probe(baileys, 'makeInMemoryStore');
  const DisconnectReason = probe(baileys, 'DisconnectReason');
  const Browsers = probe(baileys, 'Browsers');
  const fetchLatestBaileysVersion = probe(baileys, 'fetchLatestBaileysVersion');

  if (!useMultiFileAuthState || !makeWASocket) {
    logger.error('LOAD', 'Swarm failed to resolve core functions.');
    throw new Error('CRITICAL: useMultiFileAuthState could not be resolved.');
  }

  return { 
    makeWASocket, 
    useMultiFileAuthState, 
    makeInMemoryStore, 
    DisconnectReason,
    Browsers,
    fetchLatestBaileysVersion
  };
}
