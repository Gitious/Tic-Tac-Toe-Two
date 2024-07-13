<template>
  <div>
    <h1>Select Local Game Mode</h1>
    <router-link to="/local/pvp">Player vs Player (Local)</router-link>
    <router-link to="/local/pve">Player vs Computer</router-link>
  </div>
</template>

<script>
export default {
  name: 'LocalPlay'
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
