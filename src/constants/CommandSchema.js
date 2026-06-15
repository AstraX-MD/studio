/**
 * @fileOverview Documentation of the Command Plugin Schema.
 * Every plugin in src/plugins/commands must export an object matching this structure.
 */

export const CommandSchema = {
  name: "string",          // Unique identifier
  aliases: ["array"],      // Alternative trigger names
  category: "string",      // Help menu sorting (e.g., 'admin', 'download')
  description: "string",   // Brief explanation
  usage: "string",         // Example: "!play <song name>"
  cooldown: "number",      // Seconds between uses per user
  permissions: "number",   // Minimum ROLES integer required
  groupOnly: "boolean",    // Restrict to group chats
  privateOnly: "boolean",  // Restrict to DM
  ownerOnly: "boolean",    // Restrict to Bot Owner
  rootOnly: "boolean",     // Restrict to Root Admin
  premiumOnly: "boolean",  // Restrict to Premium users
  examples: ["array"],     // Real-world usage examples
  execute: "function"      // (ctx, args) => Promise<any>
};
