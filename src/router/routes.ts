import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      // auth: true
    },
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
    {
      path: 'login', component: () => import('pages/LoginPage.vue'), name: 'login', meta: {
        // auth: false
      }
    },
    {
      path: 'blub', component: () => import('pages/MapperPage.vue'), meta: {
        // auth: true
      }
    },
    {
      path: 'pouch', component: () => import('pages/PouchPage.vue'), name: 'pouch', meta: {
        // auth: true
      }
    },
    { path: 'emittent', component: () => import('pages/EmittentDetails.vue'), name: 'emittent' },
    { path: 'map', component: () => import('pages/MapEditPage.vue'), name: 'map' },
    { path: 'mapper', component: () => import('pages/MapperPage.vue'), name: 'mapper', },
    { path: 'uebersicht', component: () => import('pages/PlantPage.vue'), name: 'uebersicht' },
    { path: 'sts', component: () => import('pages/DevelopmentSts.vue'), name: 'sts' },
    {
      path: 'projects', component: () => import('pages/ProjectList.vue'), name: 'projects', meta: {
        // auth: true
      },
    },
    {
      path: 'playground', component: () => import('pages/PlaygroundPage.vue'), name: 'playground', meta: {
        // auth: true
      }
    },
    { path: 'emittent/v2/', component: () => import('pages/EmittentPageRework.vue'), name: 'emittent-details' },
    {
      path: 'fun', component: () => import('pages/PlaygroundEmittent.vue'), name: 'rollercoaster', meta: {
        // auth: true
      }
    },
    {
      path: 'messgeraete', component: () => import('pages/MessgeraeteList.vue'), name: 'messgeraete', meta: {
        // auth: true
      }
    },
    { path: 'vorlagen', component: () => import('pages/VorlagenList.vue'), name: 'vorlagen' },
    { path: 'filter', component: () => import('pages/FilterPage.vue'), name: 'filter' },
    { path: 'chatgpt1', component: () => import('pages/ChatGPTP1.vue'), name: 'chatgpt1' },
    { path: 'overviews', component: () => import('pages/MessfilesPage.vue'), name: 'overviews' }],

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
