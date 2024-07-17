<template>
  <div class="local-play">
    <div class="content">
      <h1>Select Local Game Mode</h1>
      <div class="button-container">
        <router-link to="/local/pvp" class="btn btn-pvp">Player vs Player (Local)</router-link>
        <router-link to="/local/pve" class="btn btn-pve">Player vs Computer</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocalPlay'
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Just+Me+Again+Down+Here&display=swap');

.local-play {
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

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.btn {
  display: block;
  margin: 15px 0;
  padding: 15px 30px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 24px;
  border: 3px solid #FFECEC;
  border-radius: 10px;
  background-color: #1E1E1E;
  text-decoration: none;
  transition: all 0.3s ease;
  width: 80%;
  max-width: 300px;
}

.btn-pvp {
  background-image: linear-gradient(45deg, #f6639e, #feca57);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-pve {
  background-image: linear-gradient(45deg, #568eff, #f367a1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn:hover {
  transform: scale(1.1);
}
</style>