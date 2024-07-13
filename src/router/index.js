import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LocalPlay from '../components/LocalPlay.vue';
import GameModeSelection from '../components/GameModeSelection.vue';
import GameBoard from '../components/GameBoard.vue';
import PvPOnline from '../components/PvPOnline.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/local', component: LocalPlay },
  { path: '/local/pvp', component: GameModeSelection, props: { mode: 'pvp' } },
  { path: '/local/pve', component: GameModeSelection, props: { mode: 'pve' } },
  { path: '/game', name: 'GameBoard', component: GameBoard, props: route => ({ mode: route.query.mode, gameMode: route.query.gameMode }) },
  { path: '/online', component: PvPOnline },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
