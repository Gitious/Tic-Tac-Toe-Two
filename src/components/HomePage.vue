<template>
  <div>
    <h1>Welcome to Tic Tac Toe Two</h1>
    <router-link to="/pvp">Player vs Player</router-link>
    <router-link to="/pve">Player vs Computer</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
h1 {
  text-align: center;
}
a {
  display: block;
  margin: 10px;
  text-align: center;
}
</style>
