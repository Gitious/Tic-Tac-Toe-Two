<template>
  <div>
    <h1>Select Game Mode</h1>
    <button @click="selectMode('single')">Single Game</button>
    <button @click="selectMode('bo3')">Best of 3</button>
    <button @click="selectMode('bo5')">Best of 5</button>
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
h1 {
  text-align: center;
}
button {
  display: block;
  margin: 10px auto;
}
</style>
