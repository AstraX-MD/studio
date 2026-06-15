/**
 * @fileOverview Documentation of the Event Plugin Schema.
 * Every file in src/plugins/events must export an object matching this structure.
 */

export const EventSchema = {
  name: "string",          // The Baileys event name (e.g., 'call', 'groups.update')
  description: "string",   // Purpose of the listener
  enabled: "boolean",      // Toggle switch
  execute: "function"      // (bot, eventData) => Promise<any>
};
