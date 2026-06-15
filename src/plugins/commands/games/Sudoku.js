/**
 * @fileOverview Sudoku Generator.
 */
export default {
  name: "sudoku",
  category: "games",
  description: "Generate a Sudoku grid to solve.",
  usage: "sudoku",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // Simple 4x4 Grid for WhatsApp visibility
    const grid = [];
    for(let i=0; i<4; i++) {
        let row = [];
        for(let j=0; j<4; j++) {
            row.push(Math.random() > 0.5 ? '⬜' : Math.floor(Math.random() * 4) + 1);
        }
        grid.push(row.join(' | '));
    }

    const output = `┌──⌈ 🔢 SUDOKU 4x4 ⌋
┃ 
┃ ${grid.join('\n┃ -----------\n┃ ')}
┃ 
┃ Tip: Fill the empty blocks!
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
