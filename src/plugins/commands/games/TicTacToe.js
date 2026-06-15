/**
 * @fileOverview Tic-Tac-Toe (TTT) Game Engine.
 * Supports PvP and PvE with real-time board rendering.
 */

const games = new Map(); // Global game tracker

export default {
  name: "ttt",
  aliases: ["tictactoe", "tictac"],
  category: "games",
  description: "Play Tic-Tac-Toe against the bot or a friend.",
  usage: "ttt start [@tag] / ttt move <1-9> / ttt exit",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    // 1. GAME START LOGIC
    if (sub === 'start') {
      if (games.has(ctx.jid)) return ctx.reply(`┌──⌈ ⚠️ ACTIVE ⌋\n┃ A game is already in progress.\n┃ Type ${prefix}ttt exit to stop.\n└────────────────`);

      let opponent = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 'bot';
      
      const game = {
        board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        player1: ctx.sender,
        player2: opponent,
        turn: ctx.sender,
        symbols: { [ctx.sender]: '❌', [opponent]: '⭕' }
      };

      games.set(ctx.jid, game);
      
      const render = renderBoard(game.board);
      const oppName = opponent === 'bot' ? 'AstraX AI' : `@${opponent.split('@')[0]}`;
      
      const output = `┌──⌈ 🎮 TTT STARTED ⌋
┃ 
┃ Player 1: @${ctx.sender.split('@')[0]} (❌)
┃ Player 2: ${oppName} (⭕)
┃ 
┃ ${render}
┃ 
┃ Turn: @${game.turn.split('@')[0]}
┃ Use ${prefix}ttt move <num>
└────────────────`;

      return await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, opponent].filter(p => p !== 'bot') });
    }

    // 2. MOVE LOGIC
    if (sub === 'move') {
      const game = games.get(ctx.jid);
      if (!game) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ No active game. Start one with ${prefix}ttt start\n└────────────────`);
      
      if (ctx.sender !== game.turn) return ctx.reply(`┌──⌈ ⏳ WAIT ⌋\n┃ It is not your turn.\n└────────────────`);

      const pos = parseInt(args[1]) - 1;
      if (isNaN(pos) || pos < 0 || pos > 8 || game.board[pos] === '❌' || game.board[pos] === '⭕') {
        return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Invalid move. Choose 1-9.\n└────────────────`);
      }

      // Execute Move
      game.board[pos] = game.symbols[ctx.sender];
      
      // Check Win
      if (checkWin(game.board)) {
        const result = `┌──⌈ 🏆 CHAMPION ⌋\n┃ \n┃ @${ctx.sender.split('@')[0]} WON!\n┃ \n┃ ${renderBoard(game.board)}\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return await ctx.sock.sendMessage(ctx.jid, { text: result, mentions: [ctx.sender] });
      }

      // Check Draw
      if (game.board.every(b => b === '❌' || b === '⭕')) {
        const result = `┌──⌈ 🤝 DRAW ⌋\n┃ \n┃ Game ended in a tie.\n┃ \n┃ ${renderBoard(game.board)}\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return ctx.reply(result);
      }

      // Switch Turn
      game.turn = game.player1 === ctx.sender ? game.player2 : game.player1;

      // Handle Bot Move
      if (game.turn === 'bot') {
        const available = game.board.filter(b => b !== '❌' && b !== '⭕');
        const botMove = available[Math.floor(Math.random() * available.length)];
        const botIndex = game.board.indexOf(botMove);
        game.board[botIndex] = '⭕';

        if (checkWin(game.board)) {
          const result = `┌──⌈ 🤖 AI DOMINANCE ⌋\n┃ \n┃ ${botName} WON!\n┃ \n┃ ${renderBoard(game.board)}\n└─ 🌌 ${botName.toUpperCase()}`;
          games.delete(ctx.jid);
          return ctx.reply(result);
        }
        
        game.turn = game.player1; // Back to human
      }

      const output = `┌──⌈ 🎮 TTT SESSION ⌋
┃ 
┃ ${renderBoard(game.board)}
┃ 
┃ Next: @${game.turn.split('@')[0]}
└────────────────`;
      return await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [game.turn].filter(p => p !== 'bot') });
    }

    // 3. EXIT LOGIC
    if (sub === 'exit' || sub === 'stop') {
      games.delete(ctx.jid);
      return ctx.reply(`┌──⌈ 🔌 TERMINATED ⌋\n┃ Game session cleared.\n└─ 🌌 ${botName.toUpperCase()}`);
    }

    // DEFAULT HELP
    ctx.reply(`┌──⌈ 🎮 TIC-TAC-TOE ⌋\n┃\n├─ ${prefix}ttt start\n├─ ${prefix}ttt start @user\n├─ ${prefix}ttt move <1-9>\n├─ ${prefix}ttt exit\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};

function renderBoard(board) {
  const b = board.map(v => v === '❌' ? '❌' : v === '⭕' ? '⭕' : '⬜');
  return `\n┃  ${b[0]} | ${b[1]} | ${b[2]}\n┃  ${b[3]} | ${b[4]} | ${b[5]}\n┃  ${b[6]} | ${b[7]} | ${b[8]}`;
}

function checkWin(b) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  return wins.some(w => b[w[0]] === b[w[1]] && b[w[1]] === b[w[2]]);
}
