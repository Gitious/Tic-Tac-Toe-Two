<template>
  <div>
    <h1>Player vs Player (Online)</h1>
    <div v-if="!inRoom">
      <button @click="createRoom">Host Game</button>
      <input v-model="roomId" placeholder="Enter Room ID to Join">
      <button @click="joinRoom">Join Game</button>
    </div>
    <div v-if="inRoom">
      <p>Room ID: {{ roomId }}</p>
      <GameBoard :mode="'online'" :socket="socket" :roomId="roomId" :playerMark="playerMark"></GameBoard>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import GameBoard from './GameBoard.vue';

export default {
  name: 'PvPOnline',
  components: { GameBoard },
  data() {
    return {
      socket: null,
      roomId: '',
      inRoom: false,
      playerMark: '',
    };
  },
  methods: {
    createRoom() {
      this.socket = io('http://localhost:3000');
      this.socket.emit('createRoom');
      this.socket.on('roomCreated', (roomId) => {
        this.roomId = roomId;
        this.inRoom = true;
        this.playerMark = 'X';
      });
    },
    joinRoom() {
      this.socket = io('http://localhost:3000');
      this.socket.emit('joinRoom', this.roomId);
      this.socket.on('startGame', ({ roomId, players }) => {
        this.roomId = roomId;
        this.inRoom = true;
        this.playerMark = players[0] === this.socket.id ? 'X' : 'O';
      });
      this.socket.on('roomFull', () => {
        alert('Room is full!');
      });
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
button, input {
  display: block;
  margin: 10px auto;
}
</style>
