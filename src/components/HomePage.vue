<template>
  <div>
    <h1>Welcome to Infinite Tic Tac Toe</h1>
    <router-link to="/pvp-local">Player vs Player (Local)</router-link>
    <router-link to="/pve">Player vs Computer</router-link>
    <router-link to="/pvp-online">Player vs Player Beta (Online)</router-link>
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
