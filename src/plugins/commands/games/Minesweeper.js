/**
 * @fileOverview Minesweeper Logic.
 */
export default {
  name: "minesweeper",
  aliases: ["mines"],
  category: "games",
  description: "Generate a clickable Minesweeper grid (Simulation).",
  usage: "mines",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // Manual construction of a hidden grid for WhatsApp
    const grid = [];
    for(let i=0; i<5; i++) {
        let row = [];
        for(let j=0; j<5; j++) {
            row.push('||' + (Math.random() > 0.15 ? '⬜' : '💣') + '||');
        }
        grid.push(row.join(' '));
    }

    const output = `┌──⌈ 💣 MINESWEEPER ⌋
┃ 
┃ Tap the blocks to uncover!
┃ 
${grid.join('\n┃ ')}
┃ 
┃ Status: ACTIVE
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
