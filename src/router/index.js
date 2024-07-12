import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import GameBoard from '../components/GameBoard.vue';
import PvPOnline from '../components/PvPOnline.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/pvp-local', component: GameBoard, props: { mode: 'pvp' } },
  { path: '/pve', component: GameBoard, props: { mode: 'pve' } },
  { path: '/pvp-online', component: PvPOnline },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
