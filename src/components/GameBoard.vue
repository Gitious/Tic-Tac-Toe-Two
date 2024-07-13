<template>
  <div>
    <div v-for="row in 3" :key="row" class="row">
      <button v-for="col in 3" :key="col" @click="handleClick((row - 1) * 3 + (col - 1))">
        {{ board[(row - 1) * 3 + (col - 1)] }}
      </button>
    </div>
    <p v-if="winner">{{ winner }} wins!</p>
    <p v-if="seriesWinner">{{ seriesWinner }} wins the series!</p>
    <p>Scores: X - {{ scores.X }}, O - {{ scores.O }}</p>
    <button @click="restartGame">Restart Game</button>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',
  props: {
    mode: String,
    socket: Object,
    roomId: String,
    playerMark: String,
    gameMode: String
  },
  data() {
    return {
      board: Array(9).fill(null),
      isXNext: true,
      xMoveHistory: [],
      oMoveHistory: [],
      winner: null,
      scores: { X: 0, O: 0 },
      seriesWinner: null
    };
  },
  methods: {
    handleClick(index) {
      if (this.board[index] || this.winner || this.seriesWinner || !this.canPlaceMark(index)) return;

      const newBoard = this.board.slice();
      const currentMark = this.isXNext ? 'X' : 'O';
      if (this.mode === 'online' && currentMark !== this.playerMark) return; // Only allow the current player to make a move

      newBoard[index] = currentMark;
      this.board = newBoard;
      this.isXNext = !this.isXNext;

      const moveHistory = currentMark === 'X' ? this.xMoveHistory : this.oMoveHistory;
      const newHistory = moveHistory.concat({ mark: currentMark, index });

      if (currentMark === 'X') {
        this.xMoveHistory = newHistory;
      } else {
        this.oMoveHistory = newHistory;
      }

      if (newHistory.length > 3) {
        const firstMove = newHistory[0];
        if (firstMove.mark === newBoard[firstMove.index]) {
          newBoard[firstMove.index] = null;
        }
        if (currentMark === 'X') {
          this.xMoveHistory = newHistory.slice(1);
        } else {
          this.oMoveHistory = newHistory.slice(1);
        }
      }

      this.checkWinner();

      if (this.winner) {
        this.updateScores(this.winner);
        this.checkSeriesWinner();
      }

      console.log('Current Mode:', this.mode); // Debug log
      console.log('Next Player:', this.isXNext ? 'X' : 'O'); // Debug log

      if (this.mode === 'online') {
        this.socket.emit('move', { roomId: this.roomId, board: this.board, isXNext: this.isXNext });
      } else if (!this.winner && this.mode === 'pve' && !this.isXNext) {
        console.log('Making bot move'); // Debug log
        this.makeBotMove();
      }
    },
    canPlaceMark(index) {
      const moveHistory = this.isXNext ? this.xMoveHistory : this.oMoveHistory;
      if (moveHistory.length < 3) return true;
      const firstMove = moveHistory[0];
      return firstMove.index !== index;
    },
    makeBotMove() {
      setTimeout(() => {
        const botMoveIndex = this.findBotMove();
        console.log('Bot move index:', botMoveIndex); // Debug log
        if (botMoveIndex !== null) {
          const newBoard = this.board.slice();
          newBoard[botMoveIndex] = 'O';
          this.board = newBoard;
          this.isXNext = true;
          const newHistory = this.oMoveHistory.concat({ mark: 'O', index: botMoveIndex });
          this.oMoveHistory = newHistory;

          if (newHistory.length > 3) {
            const firstMove = newHistory[0];
            if (firstMove.mark === newBoard[firstMove.index]) {
              newBoard[firstMove.index] = null;
            }
            this.oMoveHistory = newHistory.slice(1);
          }
          this.checkWinner();
          if (this.winner) {
            this.updateScores(this.winner);
            this.checkSeriesWinner();
          }
        }
      }, 500);
    },
    findBotMove() {
      let move = this.findWinningMove('O');
      if (move !== null) return move;

      move = this.findWinningMove('X');
      if (move !== null) return move;

      if (this.board[4] === null) return 4;

      const corners = [0, 2, 6, 8];
      for (let corner of corners) {
        if (this.board[corner] === null) return corner;
      }

      let emptyIndexes = [];
      this.board.forEach((cell, index) => {
        if (!cell) emptyIndexes.push(index);
      });
      if (emptyIndexes.length > 0) {
        return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      }
      return null;
    },
    findWinningMove(mark) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let [a, b, c] of lines) {
        if (this.board[a] === mark && this.board[b] === mark && this.board[c] === null) {
          return c;
        }
        if (this.board[a] === mark && this.board[c] === mark && this.board[b] === null) {
          return b;
        }
        if (this.board[b] === mark && this.board[c] === mark && this.board[a] === null) {
          return a;
        }
      }
      return null;
    },
    checkWinner() {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let [a, b, c] of lines) {
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          this.winner = this.board[a];
          return;
        }
      }
    },
    updateScores(winner) {
      this.scores[winner]++;
      if (this.gameMode === 'single') {
        this.seriesWinner = winner;
      }
    },
    checkSeriesWinner() {
      if (this.gameMode === 'bo3' && (this.scores.X === 2 || this.scores.O === 2)) {
        this.seriesWinner = this.scores.X === 2 ? 'X' : 'O';
      } else if (this.gameMode === 'bo5' && (this.scores.X === 3 || this.scores.O === 3)) {
        this.seriesWinner = this.scores.X === 3 ? 'X' : 'O';
      } else {
        this.resetBoard();
      }
    },
    resetBoard() {
      this.board = Array(9).fill(null);
      this.isXNext = true;
      this.xMoveHistory = [];
      this.oMoveHistory = [];
      this.winner = null;
    },
    restartGame() {
      this.board = Array(9).fill(null);
      this.isXNext = true;
      this.xMoveHistory = [];
      this.oMoveHistory = [];
      this.winner = null;
      this.scores = { X: 0, O: 0 };
      this.seriesWinner = null;
    }
  },
  mounted() {
    if (this.mode === 'online' && this.socket) {
      this.socket.on('moveMade', (data) => {
        if (data.board && data.board.length === 9) {
          this.board = data.board;
          this.isXNext = data.isXNext;
          this.checkWinner();
        }
      });
    }
  }
};
</script>

<style scoped>
.row {
  display: flex;
  justify-content: center;
}
button {
  width: 100px;
  height: 100px;
  font-size: 24px;
}
</style>
