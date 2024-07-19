<template>
  <div class="pvp-online">
    <h1>Play Online</h1>
    <p v-if="roomId" class="room-code">Room Code: {{ roomId }}</p>
    <div v-if="!roomId" class="game-setup">
      <button @click="createRoom" class="btn btn-host">Host Game</button>
      <p class="or">or</p>
      <input v-model="joinRoomId" placeholder="Enter Room ID" class="room-input" />
      <button @click="joinRoom" class="btn btn-join">Join Game</button>
    </div>
    <GameBoardOnline 
      v-if="gameStarted" 
      :socket="socket" 
      :roomId="roomId" 
      :playerMark="playerMark"
      :gameMode="gameMode"
      @updateScore="updateScores"
      @playSound="playSound" 
      @restartGame="handleRestartGame"
    />
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import GameBoardOnline from './GameBoardOnline.vue';

export default {
  name: 'PvPOnline',
  components: {
    GameBoardOnline
  },
  data() {
    return {
      socket: null,
      roomId: null,
      joinRoomId: '',
      gameStarted: false,
      playerMark: '',
      gameMode: 'bo3', // or 'bo5'
      scores: { X: 0, O: 0 },
      soundX: null,
      soundO: null,
      backgroundMusic: null
    };
  },
  methods: {
    createRoom() {
      this.socket.emit('createRoom');
    },
    joinRoom() {
      if (this.joinRoomId.trim() === '') {
        alert('Please enter a room ID');
        return;
      }
      this.socket.emit('joinRoom', this.joinRoomId.trim());
    },
    updateScores(scores) {
      this.scores = scores;
    },
    playSound(type) {
      if (type === 'X') {
        this.soundX.play();
      } else if (type === 'O') {
        this.soundO.play();
      }
    },
    startBackgroundMusic() {
      this.backgroundMusic.play();
    },
    handleRestartGame() {
      this.scores = { X: 0, O: 0 };
      if (this.socket) {
        this.socket.emit('restartGame', { roomId: this.roomId });
      }
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.socket.on('roomCreated', (roomId) => {
      this.roomId = roomId;
      this.playerMark = 'X';
      console.log(`Room created with ID: ${roomId}`);
    });

    this.socket.on('startGame', (roomId) => {
      this.roomId = roomId;
      this.gameStarted = true;
      this.playerMark = this.playerMark === '' ? 'O' : this.playerMark;
      console.log(`Joined room with ID: ${roomId}`);
    });

    this.socket.on('roomFull', () => {
      alert('Room is full. Please try joining another room.');
    });

    this.socket.on('disconnect', () => {
      console.log('Client disconnected');
      this.roomId = null;
      this.gameStarted = false;
      this.playerMark = '';
    });

    // Initialize audio
    this.soundX = new Audio(require('@/assets/sound1.mp3'));
    this.soundO = new Audio(require('@/assets/sound2.mp3'));
    this.backgroundMusic = new Audio(require('@/assets/bkgd-music.mp3'));
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.startBackgroundMusic();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Just+Me+Again+Down+Here&display=swap');

.pvp-online {
  background-image: url('../assets/bkgd\ img\ p2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #ffffff;
  min-height: 100vh; 
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Just Me Again Down Here', Verdana, Geneva, Tahoma, sans-serif;
  padding-top: 20px;
  box-sizing: border-box;
}

h1 {
  font-family: 'Luckiest Guy', cursive;
  font-size: 42px;
  color: #ff4583;
  margin-bottom: 10px;
}

.room-code {
  font-family: 'Luckiest Guy', cursive;
  font-size: 22px;
  margin-bottom: 20px;
}

.or {
  font-family: 'Just Me Again Down Here', Verdana;
  font-size: 36px;
}

.game-setup {
  background-color: rgba(50, 50, 50, 0.596);
  padding: 15px;
  border-radius: 10px;
  width: 400px;
  height: 300px;
  margin:25px 0px 20px 0px;
}

.room-input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 80%;
  font-size: 18px;
  background-color: #1E1E1E;
  color: #ffffff;
  border: 2px solid #FFECEC;
  border-radius: 5px;
}

.btn {
  display: block;
  margin: 15px auto;
  padding: 10px 20px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 18px;
  border: 3px solid #FFECEC;
  border-radius: 10px;
  background-color: #1E1E1E;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-host {
  background-image: linear-gradient(45deg, #28d986, #2bc2f0 ,#5c2bf0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-join {
  background-image: linear-gradient(45deg, #fb4848, #ff9ff3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn:hover {
  transform: scale(1.1);
}

.waiting-text, .started-text {
  font-size: 24px;
  font-family: 'Just Me Again Down Here', cursive;
  text-align: center;
}
.code{
  font-family:  'Luckiest Guy', cursive;
  font-size: 29px;
  text-align: center;
  padding-top: 5px;
}
.scoreboard {
  display: flex;
  justify-content: center;
  gap: 540px;
  margin-bottom: 0px;
  position: absolute;
  top: 296px;
  left: 50%;
  transform: translateX(-50%);
  width: 1267px;
}

.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

.score-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff2277, #ff851a);
  z-index: 0;
  border-radius: 12px;
}

.score-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a1a1a;
  z-index: 1;
  margin: 2px;
  border-radius: 8px;
}

.score-card > * {
  position: relative;
  z-index: 2;
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
</style>