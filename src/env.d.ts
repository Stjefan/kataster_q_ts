/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare module '@websanova/vue-auth/dist/drivers/auth/bearer.esm.js'
declare module '@websanova/vue-auth/dist/drivers/auth/basic.esm.js'
declare module '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js'
declare module '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js'
