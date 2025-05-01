import { sleep } from "bun";
import { Elysia } from "elysia";
import type { ElysiaWS } from "elysia/ws";

const app = new Elysia();

let board = ["", "", "", "", "", "", "", "", ""];
let turn = 2;
const clients: ElysiaWS[] = [];

app.ws("/ws", {
  open(ws) {
    console.log("Client connected");

    if (clients.length > 2) {
      ws.send(
        JSON.stringify({
          message: "Maximum number of clients reached. Please try again later.",
        }),
      );
      console.log("Maximum number of clients reached. Closing connection.");
      ws.close();
      return;
    }

    clients.push(ws);
    console.log("Client count:", clients.length);
    ws.send(JSON.stringify({ list: board }));

    if (clients.length === 2) {
      turnHandler(ws);
    } else if (clients.length === 1) {
      ws.send(
        JSON.stringify({
          message: "Waiting for another player to join...",
        }),
      );
    }
  },
  message(ws, message) {
    console.log("Received:", message);
    const data = message as { list: string[] };

    board = data.list ? data.list : board;

    const { winner } = checkWinner(board);
    if (winner) {
      if (winner === "draw") {
        for (const client of clients) {
          client.send(
            JSON.stringify({
              message: "It's a draw!",
              list: board,
              turn: 0,
            }),
          );
        }

        console.log("It's a draw!");
      } else {
        for (const client of clients) {
          client.send(
            JSON.stringify({
              message: `Player ${winner} wins!`,
              list: board,
              turn: 0,
            }),
          );
        }

        console.log(`Player ${winner} wins!`);
        sleep(1000).then(() => {
          console.log("Resetting game...");
          for (let i = clients.length - 1; i >= 0; i--) {
            clients[i].close();
          }
        });
      }
      board = ["", "", "", "", "", "", "", "", ""];
      turn = 2;
      return;
    }
    turnHandler(ws);
  },
  close(ws) {
    console.log("Client disconnected");
    const index = clients.indexOf(ws);
    clients.splice(index, 1);
    console.log("Client count:", clients.length);

    if (clients.length === 0) {
      board = ["", "", "", "", "", "", "", "", ""];
      turn = 2;
    }
  },
});

app.listen(3000);
console.log("🦊 Elysia server running at http://localhost:3000");

function turnHandler(ws: ElysiaWS) {
  if (turn === 1) {
    clients[0].send({
      player: 1,
      message: "It's your turn!",
      list: board,
      turn: turn,
    });
    clients[1].send({
      player: 2,
      message: "Player 1 is taking their turn...",
      list: board,
      turn: turn,
    });

    turn = 2;
  } else if (turn === 2) {
    clients[0].send({
      player: 1,
      message: "Player 2 is taking their turn...",
      list: board,
      turn: turn,
    });
    clients[1].send({
      player: 2,
      message: "Player 2, it's your turn!",
      list: board,
      turn: turn,
    });

    turn = 1;
  }
}

function checkWinner(board: string[]) {
  // All possible winning combinations
  const winningCombinations = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check each winning combination
  for (const [a, b, c] of winningCombinations) {
    // If all three positions have the same non-empty value, we have a winner
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a], // 'X' or 'O'
        winningCombination: [a, b, c],
      };
    }
  }

  // Check for a draw (all cells filled with no winner)
  if (board.every((cell) => cell)) {
    return { winner: "draw" };
  }

  // No winner yet
  return { winner: null };
}
