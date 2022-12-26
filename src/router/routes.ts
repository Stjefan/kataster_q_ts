import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
    { path: 'login', component: () => import('pages/LoginPage.vue'), name: 'login' },
    { path: 'blub', component: () => import('pages/MapperPage.vue') },
    { path: 'emittent', component: () => import('pages/EmittentDetails.vue'), name: 'emittent' },
    { path: 'map', component: () => import('pages/MapPage.vue'), name: 'map' },
    { path: 'uebersicht', component: () => import('pages/PlantPage.vue'), name: 'uebersicht' },
    { path: 'sts', component: () => import('pages/DevelopmentSts.vue'), name: 'sts' },
    { path: 'projects', component: () => import('pages/ProjectList.vue'), name: 'projects' },
    { path: 'messgeraete', component: () => import('pages/MessgeraeteList.vue'), name: 'messgeraete' },
    { path: 'vorlagen', component: () => import('pages/VorlagenList.vue'), name: 'vorlagen' },
    { path: 'filter', component: () => import('pages/FilterPage.vue'), name: 'filter' }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
