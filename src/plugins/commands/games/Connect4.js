/**
 * @fileOverview Connect Four Game Engine (PvP/AI).
 */
const games = new Map();

export default {
  name: "connect4",
  aliases: ["c4"],
  category: "games",
  description: "Play Connect Four against a friend or the bot.",
  usage: "c4 start [@tag] / c4 drop <1-7> / c4 exit",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      if (games.has(ctx.jid)) return ctx.reply(`┌──⌈ ⚠️ ACTIVE ⌋\n┃ Match in progress. Use ${prefix}c4 exit to end.\n└────────────────`);
      
      let opponent = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 'bot';
      const game = {
        board: Array(6).fill(null).map(() => Array(7).fill('⚪')),
        player1: ctx.sender,
        player2: opponent,
        turn: ctx.sender,
        symbols: { [ctx.sender]: '🔴', [opponent]: '🟡' }
      };

      games.set(ctx.jid, game);
      const output = `┌──⌈ 🕹️ CONNECT 4 ⌋
┃ 
┃ Player 1: @${ctx.sender.split('@')[0]} (🔴)
┃ Player 2: ${opponent === 'bot' ? 'AstraX AI' : '@' + opponent.split('@')[0]} (🟡)
┃ 
┃ ${renderBoard(game.board)}
┃ 
┃ Use ${prefix}c4 drop <1-7>
└────────────────`;
      return await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, opponent].filter(p => p !== 'bot') });
    }

    if (sub === 'drop') {
      const game = games.get(ctx.jid);
      if (!game) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ No active game.\n└────────────────");
      if (ctx.sender !== game.turn) return ctx.reply("┌──⌈ ⏳ WAIT ⌋\n┃ Not your turn.\n└────────────────");

      const col = parseInt(args[1]) - 1;
      if (isNaN(col) || col < 0 || col > 6) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Choose column 1-7.\n└────────────────");

      // Drop Logic
      let dropped = false;
      for (let r = 5; r >= 0; r--) {
        if (game.board[r][col] === '⚪') {
          game.board[r][col] = game.symbols[ctx.sender];
          dropped = true;
          break;
        }
      }
      if (!dropped) return ctx.reply("┌──⌈ 🚫 FULL ⌋\n┃ That column is full!\n└────────────────");

      if (checkWin(game.board, game.symbols[ctx.sender])) {
        const res = `┌──⌈ 🏆 WINNER ⌋\n┃ \n┃ @${ctx.sender.split('@')[0]} CONNECTED 4!\n┃ \n┃ ${renderBoard(game.board)}\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return await ctx.sock.sendMessage(ctx.jid, { text: res, mentions: [ctx.sender] });
      }

      game.turn = game.player1 === ctx.sender ? game.player2 : game.player1;
      
      if (game.turn === 'bot') {
        const availableCols = [];
        for (let c = 0; c < 7; c++) if (game.board[0][c] === '⚪') availableCols.push(c);
        const bCol = availableCols[Math.floor(Math.random() * availableCols.length)];
        for (let r = 5; r >= 0; r--) {
          if (game.board[r][bCol] === '⚪') {
            game.board[r][bCol] = '🟡';
            break;
          }
        }
        if (checkWin(game.board, '🟡')) {
          const res = `┌──⌈ 🤖 AI WIN ⌋\n┃ \n┃ Better luck next time.\n┃ \n┃ ${renderBoard(game.board)}\n└─ 🌌 ${botName.toUpperCase()}`;
          games.delete(ctx.jid);
          return ctx.reply(res);
        }
        game.turn = game.player1;
      }

      const output = `┌──⌈ 🕹️ CONNECT 4 ⌋\n┃ \n┃ ${renderBoard(game.board)}\n┃ \n┃ Turn: @${game.turn.split('@')[0]}\n└────────────────`;
      return await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [game.turn].filter(p => p !== 'bot') });
    }

    if (sub === 'exit') {
      games.delete(ctx.jid);
      return ctx.reply(`┌──⌈ 🔌 EXIT ⌋\n┃ Game terminated.\n└─ 🌌 ${botName.toUpperCase()}`);
    }

    ctx.reply(`┌──⌈ 🕹️ CONNECT 4 ⌋\n┃\n├─ ${prefix}c4 start\n├─ ${prefix}c4 drop <1-7>\n├─ ${prefix}c4 exit\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};

function renderBoard(board) {
  return board.map(row => '┃ ' + row.join(' ')).join('\n') + '\n┃ 1 2 3 4 5 6 7';
}

function checkWin(b, s) {
  // Horizontal
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (b[r][c] === s && b[r][c+1] === s && b[r][c+2] === s && b[r][c+3] === s) return true;
    }
  }
  // Vertical
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      if (b[r][c] === s && b[r+1][c] === s && b[r+2][c] === s && b[r+3][c] === s) return true;
    }
  }
  // Diagonal
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (b[r][c] === s && b[r-1][c+1] === s && b[r-2][c+2] === s && b[r-3][c+3] === s) return true;
    }
  }
  for (let r = 3; r < 6; r++) {
    for (let c = 3; c < 7; c++) {
      if (b[r][c] === s && b[r-1][c-1] === s && b[r-2][c-2] === s && b[r-3][c-3] === s) return true;
    }
  }
  return false;
}
