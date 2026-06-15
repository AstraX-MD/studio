/**
 * @fileOverview Programming reference tool.
 */
export default {
  name: "code",
  category: "education",
  description: "Get quick code snippet references (JS/TS/Python).",
  usage: "code <language>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const lang = args[0]?.toLowerCase();

    const snippets = {
      js: 'console.log("Hello World");',
      python: 'print("Hello World")',
      ts: 'const hello: string = "Hello World";'
    };

    const code = snippets[lang] || 'Please specify: js, ts, or python';

    const output = `┌──⌈ 💻 CODE REF ⌋
┃
┃ Language: ${lang?.toUpperCase() || 'UNKNOWN'}
┃ Snippet:
┃ ${code}
┃
└────────────────
  © ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
