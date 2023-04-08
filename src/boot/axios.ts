import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

import { useKatasterStore } from 'src/stores/kataster-store';
import { GesturePlugin } from '@vueuse/gesture'


import { plugin, defaultConfig } from '@formkit/vue'
import { createFloatingLabelsPlugin } from '@formkit/addons'
import '@formkit/addons/css/floatingLabels'

import { createI18n } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

import { Notify } from 'quasar'





// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:8000/kataster/' });

export default boot(async ({ app, router }) => {


  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.errorHandler = (err, vm, info) => {
    window.alert(err)
    console.error(err)
    throw err
  }

  const numberFormats = {
    'en-US': {
      currency: {
        style: 'currency', currency: 'USD', notation: 'standard'
      },
      decimal: {
        style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
      },
      percent: {
        style: 'percent', useGrouping: false
      }
    },
    'de-De': {
      currency: {
        style: 'currency', currency: '€', notation: 'standard'
      },
      decimal: {
        style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 4
      },
      percent: {
        style: 'percent', useGrouping: false
      }
    },
  }

  const i18n = createI18n({
    legacy: false,
    number: numberFormats
    // something vue-i18n options here ...
  })
  app.use(i18n)


  app.use(plugin, defaultConfig({
    theme: 'genesis',
    plugins: [
      createFloatingLabelsPlugin({
        useAsDefault: false, // defaults to false
      }),
    ],
  }))
  const store = useKatasterStore()
  await store.init()
  // app.use(GesturePlugin)



  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
