<template>
  <div class="pvp-online">
    <div class="content">
    <h1>Play Online</h1>
    <div v-if="!roomId" class="game-setup">
      <button @click="createRoom" class="btn btn-host">Host Game</button>
      <p> or </p>
      <input v-model="joinRoomId" placeholder="Enter Room ID" class="room-input" />
      <button @click="joinRoom" class="btn btn-join">Join Game</button>
    </div>
    <div v-else class="game-info">
      <p v-if="!gameStarted" class="waiting-text">
        Waiting for opponent...<br>
        Room ID: {{ roomId }}
      </p>
      <p v-if="gameStarted" class="started-text">Game started! Room ID: {{ roomId }}</p>
      <GameBoard v-if="gameStarted" :mode="'online'" :socket="socket" :roomId="roomId" :playerMark="playerMark" />
    </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import GameBoard from './GameBoard.vue';

export default {
  name: 'PvPOnline',
  components: {
    GameBoard
  },
  data() {
    return {
      socket: null,
      roomId: null,
      joinRoomId: '',
      gameStarted: false,
      playerMark: ''
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
  justify-content: center;
  align-items: center;
  font-family: 'Just Me Again Down Here', Verdana, Geneva, Tahoma, sans-serif;
  position: relative;
  overflow: hidden;
}
.content {
  display: flex;
  margin-bottom: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 800px;
  width: 90%;
  padding: 20px;
  box-sizing: border-box;
}
h1 {
  font-family: 'Luckiest Guy', cursive;
  font-size: 48px;
  color: #FFECEC;
  margin-bottom: 30px;
}
p {
  font-size: 36px;
  padding: 0px;
  margin-bottom: 10px;
}

.game-setup, .game-info {
  background-color: rgba(50, 50, 50, 0.596);
  padding: 15px;
  border-radius: 10px;
  width: 400px;
  height: 320px;
  max-width: 500px;
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
  padding: 15px 30px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 24px;
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
  margin-bottom: 2px;
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
  text-align: center;
}
</style>