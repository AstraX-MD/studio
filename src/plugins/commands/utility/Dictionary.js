/**
 * @fileOverview Dictionary command with WolfBot Box Styling.
 */
export default {
  name: "define",
  category: "utility",
  description: "Lookup word definitions (Mock).",
  usage: "!define <word>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    if (!args[0]) return ctx.reply("Please provide a word.");
    const word = args[0];
    
    const output = `┌──⌈ DICTIONARY ⌋
┃ Word: ${word}
┃ Definition: [ Fetching... ]
┃ Example: [ Processing... ]
└────────────────`;
    await ctx.reply(output);
  }
};