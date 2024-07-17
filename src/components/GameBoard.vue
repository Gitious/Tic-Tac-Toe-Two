<template>
  <div class="game-container">
    <h1 class="game-title">Tic-Tac-Toe-Two</h1>
    <div class="game-board">
      <div v-for="row in 3" :key="row" class="row">
        <button 
          v-for="col in 3" 
          :key="col" 
          @click="handleClick((row - 1) * 3 + (col - 1))"
          class="cell"
        >
          <img v-if="board[(row - 1) * 3 + (col - 1)]?.img" 
               :src="board[(row - 1) * 3 + (col - 1)].img" 
               :alt="board[(row - 1) * 3 + (col - 1)].symbol"
               class="symbol-image">
        </button>
      </div>
    </div>
    <div class="game-info">
      <div v-if="seriesWinner" class="series-winner-announcement" @click="dismissWinnerAnnouncement">
        <p class="series-winner-text">{{ seriesWinner }} wins the series!</p>
      </div>
      <div class="scoreboard">
        <div class="score-card score-x">
          <img :src="xImages[0]" alt="X" class="score-icon">
          <p class="score">{{ scores.X }}</p>
        </div>
        <div class="score-card score-o">
          <img :src="oImages[0]" alt="O" class="score-icon">
          <p class="score">{{ scores.O }}</p>
        </div>
      </div>
      <button @click="restartGame" class="restart-button">Restart Game</button>
    </div>
  </div>
</template>

<script>
import x1Image from '../assets/X1.png';
import x2Image from '../assets/X2.png';
import x3Image from '../assets/X3.png';
import x4Image from '../assets/X4.png';
import x5Image from '../assets/X5.png';

import o1Image from '../assets/O1.png';
import o2Image from '../assets/O2.png';
import o3Image from '../assets/O3.png';
import o4Image from '../assets/O4.png';
import o5Image from '../assets/O5.png';

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
      seriesWinner: null,
      xImages: [x1Image, x2Image, x3Image, x4Image, x5Image],
      oImages: [o1Image, o2Image, o3Image, o4Image, o5Image],
      usedImages: []
    };
  },
  computed: {
    canPlaceMark() {
      return (index) => {
        const moveHistory = this.isXNext ? this.xMoveHistory : this.oMoveHistory;
        if (moveHistory.length < 3) return true;
        const firstMove = moveHistory[0];
        return firstMove.index !== index;
      };
    }
  },
  methods: {
    handleClick(index) {
      if (this.board[index] || this.winner || this.seriesWinner || !this.canPlaceMark(index)) return;

      const currentMark = this.isXNext ? 'X' : 'O';
      if (this.mode === 'online' && currentMark !== this.playerMark) return;

      const imageArray = currentMark === 'X' ? this.xImages : this.oImages;
      const availableImages = imageArray.filter(img => !this.usedImages.includes(img));
      
      if (availableImages.length === 0) {
        console.error('No available images');
        return;
      }
      
      const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      
      const newBoard = this.board.slice();
      newBoard[index] = { symbol: currentMark, img: randomImage };
      this.usedImages.push(randomImage);
      this.isXNext = !this.isXNext;

      const moveHistory = currentMark === 'X' ? this.xMoveHistory : this.oMoveHistory;
      const newHistory = moveHistory.concat({ mark: currentMark, index, img: randomImage });

      if (currentMark === 'X') {
        this.xMoveHistory = newHistory;
      } else {
        this.oMoveHistory = newHistory;
      }

      if (newHistory.length > 3) {
        const firstMove = newHistory[0];
        if (newBoard[firstMove.index] && newBoard[firstMove.index].symbol === firstMove.mark) {
          this.usedImages = this.usedImages.filter(img => img !== firstMove.img);
          newBoard[firstMove.index] = null;
        }
        if (currentMark === 'X') {
          this.xMoveHistory = newHistory.slice(1);
        } else {
          this.oMoveHistory = newHistory.slice(1);
        }
      }

      this.board = newBoard;
      this.checkWinner();

      if (this.winner) {
        this.updateScores(this.winner);
        this.checkSeriesWinner();
      }

      if (this.mode === 'online') {
        this.socket.emit('move', { roomId: this.roomId, board: this.board, isXNext: this.isXNext });
      } else if (!this.winner && this.mode === 'pve' && !this.isXNext) {
        this.makeBotMove();
      }
    },
    makeBotMove() {
      setTimeout(() => {
        const botMoveIndex = this.findBotMove();
        if (botMoveIndex !== null) {
          const availableImages = this.oImages.filter(img => !this.usedImages.includes(img));
          
          if (availableImages.length === 0) {
            console.error('No available images for bot move');
            return;
          }
          
          const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
          
          const newBoard = this.board.slice();
          newBoard[botMoveIndex] = { symbol: 'O', img: randomImage };
          this.usedImages.push(randomImage);
          this.isXNext = true;
          const newHistory = this.oMoveHistory.concat({ mark: 'O', index: botMoveIndex, img: randomImage });
          this.oMoveHistory = newHistory;

          if (newHistory.length > 3) {
            const firstMove = newHistory[0];
            if (newBoard[firstMove.index] && newBoard[firstMove.index].symbol === 'O') {
              this.usedImages = this.usedImages.filter(img => img !== firstMove.img);
              newBoard[firstMove.index] = null;
            }
            this.oMoveHistory = newHistory.slice(1);
          }

          this.board = newBoard;
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
        if (this.board[a]?.symbol === mark && this.board[b]?.symbol === mark && this.board[c] === null) {
          return c;
        }
        if (this.board[a]?.symbol === mark && this.board[c]?.symbol === mark && this.board[b] === null) {
          return b;
        }
        if (this.board[b]?.symbol === mark && this.board[c]?.symbol === mark && this.board[a] === null) {
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
        if (this.board[a] && 
            this.board[a].symbol === this.board[b]?.symbol && 
            this.board[a].symbol === this.board[c]?.symbol) {
          this.winner = this.board[a].symbol;
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
      this.hideWinnerAnnouncementAfterDelay();
    } else if (this.gameMode === 'bo5' && (this.scores.X === 3 || this.scores.O === 3)) {
      this.seriesWinner = this.scores.X === 3 ? 'X' : 'O';
      this.hideWinnerAnnouncementAfterDelay();
    } else {
      this.resetBoard();
    }
  },

  hideWinnerAnnouncementAfterDelay() {
    setTimeout(() => {
      this.seriesWinner = null;
    }, 3000); // Disappears after 3 seconds
  },

  dismissWinnerAnnouncement() {
    this.seriesWinner = null;
  },
    resetBoard() {
      this.board = Array(9).fill(null);
      this.isXNext = true;
      this.xMoveHistory = [];
      this.oMoveHistory = [];
      this.winner = null;
      this.usedImages = [];
    },
    restartGame() {
      this.resetBoard();
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
.game-container {
  background-image: url('../assets/bkgd\ img\ p2.png');
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.game-title {
  font-size: 3rem;
  font-family: 'Luckiest Guy', cursive;
  margin-bottom: 2rem;
  background-color: #ffdef0;  /* background: linear-gradient(45deg, #53c9fc, #dbff92, #f0bf56,#fa69c0); */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.game-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffe5ae;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(255, 215, 115);
}

.row {
  display: flex;
  gap: 10px;
}

.cell {
  width: 100px;
  height: 100px;
  background-color: #1a1a1a;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 5px;
}

.cell:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.symbol-image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.game-info {
  margin-top: 20px;
  text-align: center;
  color: white;
  width: 100%;
}

.series-winner-announcement {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.series-winner-text {
  font-size: 48px;
  font-family: 'Luckiest Guy', cursive;
  /* font-weight: bold; */
  text-transform: uppercase;
  background: linear-gradient(45deg, #40c33c, #1797f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.scoreboard {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 15px;
}

.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
  background: #1a1a1a;
  position: relative;
}

.score-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  border-radius: 12px;
  z-index: -1;
}

.score-x::before {
  background: linear-gradient(45deg, #ff00ff, #ff66ff);
}

.score-o::before {
  background: linear-gradient(45deg, #00ffff, #66ffff);
}

.score-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}

.score {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-x .score {
  background: linear-gradient(45deg, #ff00ff, #ff66ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-o .score {
  background: linear-gradient(45deg, #00ffff, #66ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.restart-button {
  display: block;
  margin: 20px auto;
  padding: 10px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 24px;
  border: 3px solid #ffdef0;
  border-radius: 10px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  /* width: 200px;
  background-image: linear-gradient(45deg, #fc7b4c, #ffd06a);
  -webkit-background-clip: text; */
  /* background-clip: text; */
  color: #ffdef0;
}

.restart-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.726);
}
</style>
