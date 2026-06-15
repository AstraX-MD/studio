/**
 * @fileOverview Retro Snake Simulation.
 */
export default {
  name: "snake",
  category: "games",
  description: "A text-based simulation of the classic Snake game.",
  usage: "snake",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const grid = [];
    for(let i=0; i<6; i++) {
        let row = [];
        for(let j=0; j<6; j++) {
            if (i === 2 && j < 5 && j > 1) row.push('🟢'); // Snake body
            else if (i === 2 && j === 5) row.push('🟡'); // Snake head
            else if (i === 4 && j === 4) row.push('🍎'); // Apple
            else row.push('⬛');
        }
        grid.push(row.join(''));
    }

    const output = `┌──⌈ 🐍 SNAKE SIM ⌋
┃ 
${grid.join('\n┃ ')}
┃ 
┃ Score: 120
┃ Status: RENDERING...
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
