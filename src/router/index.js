import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import GameBoard from '../components/GameBoard.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/pvp', component: GameBoard, props: { mode: 'pvp' } },
  { path: '/pve', component: GameBoard, props: { mode: 'pve' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
