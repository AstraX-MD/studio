/**
 * @fileOverview Weather command with WolfBot Box Styling.
 */
export default {
  name: "weather",
  category: "utility",
  description: "Check current weather (Mock).",
  usage: "!weather <city>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    if (!args[0]) return ctx.reply("Please provide a city name.");
    const city = args.join(" ");
    
    const output = `┌──⌈ WEATHER ⌋
┃ City: ${city}
┃ Temp: 24°C
┃ Status: Clear Sky
┃ Wind: 12km/h
└────────────────`;
    await ctx.reply(output);
  }
};