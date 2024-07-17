<template>
  <div class="homepage">
    <div class="content">
      <h1>TIC TAC TOE TWO</h1>
      <p class="welcome-text">Welcome to the infinite tic tac toe game.</p>
      <div class="instructions">
        <h2>Instructions:</h2>
        <p>
          Play your turn but after your third move your first move vanishes. So,
          remember to remember your move (and your opponent's!). First player to get 3
          in a row wins!
        </p>
      </div>
      <div class="buttons">
        <router-link to="/local" class="btn btn-local">Play Local</router-link>
        <router-link to="/online" class="btn btn-online">Play Online</router-link>
      </div>
    </div>
    <div class="decorative-shapes">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
      <div class="shape shape4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Just+Me+Again+Down+Here&display=swap');

.homepage {
  background-image: url('../assets/bkgd\ img\ xo.png'); /* Replace with the actual path to your image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #ffffff;
  height: 100vh; 
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Just Me Again Down Here', Verdana, Geneva, Tahoma, sans-serif;
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  max-width: 800px;
  width: 90%;
  padding: 0;
  z-index: 1;
}

h1 {
  font-family: 'Luckiest Guy', cursive;
  font-size: 70px;
  margin-bottom: 10px;
  color: #ff4583;
  white-space: nowrap;
}

.welcome-text {
  font-size: 36px;
  margin-bottom: 20px;
}

.instructions {
  text-align: left;
  margin-bottom: 30px;
  background-color: rgba(66, 66, 66, 0.733);
  padding: 30px;
  border-radius: 10px;
}

h2 {
  font-family: 'Luckiest Guy', cursive;
  margin-top: 0;
  font-size: 36px;
  text-decoration: underline;
  color: #FFECEC;
}

.instructions p {
  font-size: 30px;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  display: inline-block;
  padding: 15px 30px; 
  margin: 15px;
  border: 3px solid #FFECEC;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 200px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1.5em; 
  background-color: #1E1E1E;
}

.btn-local {
  background-image: linear-gradient(45deg, #f6639e, #feca57);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-online {
  background-image: linear-gradient(45deg, #568eff, #f367a1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn:hover {
  transform: scale(1.1);
}


</style>