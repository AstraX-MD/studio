/**
 * @fileOverview Manage environment variables from WhatsApp.
 */
export default {
  name: "env",
  aliases: ["setenv", "getenv"],
  category: "sudo",
  description: "View or modify system environment variables.",
  usage: "env <key>=<value> or env <key>",
  permissions: 10, // ROOT ONLY
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const input = args[0];

    if (!input) {
      const keys = Object.keys(process.env).filter(k => !k.includes('TOKEN') && !k.includes('KEY') && !k.includes('PASS'));
      return ctx.reply(`┌──⌈ 🔑 ENV VARS ⌋\n┃ Total: ${keys.length}\n┃ Sample: ${keys.slice(0, 10).join(', ')}...\n└────────────────`);
    }

    if (input.includes('=')) {
      const [key, ...valParts] = input.split('=');
      const val = valParts.join('=');
      process.env[key] = val;
      return ctx.reply(`┌──⌈ ✅ ENV UPDATE ⌋\n┃ Key: ${key}\n┃ Value: ${val}\n┃ Status: Applied to Process\n└─ 🌌 ${botName.toUpperCase()}`);
    }

    const value = process.env[input] || 'UNDEFINED';
    const secureValue = input.toLowerCase().includes('key') || input.toLowerCase().includes('pass') ? '********' : value;

    ctx.reply(`┌──⌈ 🏷️ ENV VALUE ⌋\n┃ Key: ${input}\n┃ Value: ${secureValue}\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};