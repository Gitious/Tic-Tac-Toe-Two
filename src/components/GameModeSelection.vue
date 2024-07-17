<template>
  <div class="game-mode-selection">
    <div class="content">
    <h1>Select Game Mode</h1>
    <button @click="selectMode('single')" class="btn btn-single">Single Game</button>
    <button @click="selectMode('bo3')" class="btn btn-bo3">Best of 3</button>
    <button @click="selectMode('bo5')" class="btn btn-bo5">Best of 5</button>
  </div>
  </div>
</template>

<script>
export default {
  name: 'GameModeSelection',
  props: {
    mode: String
  },
  methods: {
    selectMode(gameMode) {
      this.$router.push({ name: 'GameBoard', query: { mode: this.mode, gameMode } });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Just+Me+Again+Down+Here&display=swap');

.game-mode-selection {
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
  color: #ff4583;
  margin-bottom: 30px;
}

.btn {
  display: block;
  margin: 20px auto;
  padding: 15px 30px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 24px;
  border: 3px solid #FFECEC;
  border-radius: 10px;
  background-color: #1E1E1E;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 200px;
}

.btn-single {
  background-image: linear-gradient(45deg, #fc7b4c, #ffd06a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-bo3 {
  background-image: linear-gradient(45deg, #ff5ebf, #bf5ce6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-bo5 {
  background-image: linear-gradient(45deg, #7cb7ff, #ad83ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn:hover {
  transform: scale(1.1);
}
</style>