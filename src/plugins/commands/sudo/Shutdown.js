/**
 * @fileOverview Terminate the bot process.
 */
export default {
  name: "shutdown",
  category: "sudo",
  description: "Kill the bot process safely.",
  usage: "!shutdown",
  permissions: 10, // ROOT ONLY
  execute: async (ctx) => {
    await ctx.reply("┌──⌈ SYSTEM ⌋\n┃ Terminating AstraX Engine...\n┃ Status: Offline\n└────────────────");
    setTimeout(() => process.exit(0), 2000);
  }
};