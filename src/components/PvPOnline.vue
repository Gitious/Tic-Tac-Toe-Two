<template>
  <div>
    <h1>Play Online</h1>
    <div v-if="!roomId">
      <button @click="createRoom">Host Game</button>
      <input v-model="joinRoomId" placeholder="Enter Room ID" />
      <button @click="joinRoom">Join Game</button>
    </div>
    <div v-else>
      <p v-if="!gameStarted">
        Waiting for opponent...<br>
        Room ID: {{ roomId }}
      </p>
      <p v-if="gameStarted">Game started! Room ID: {{ roomId }}</p>
      <GameBoard v-if="gameStarted" :mode="'online'" :socket="socket" :roomId="roomId" :playerMark="playerMark" />
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
h1 {
  text-align: center;
}
input {
  display: block;
  margin: 10px auto;
  padding: 5px;
}
button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
}
</style>
