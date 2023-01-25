import { createAuth } from '@websanova/vue-auth';
import driverAuthBearer from '@websanova/vue-auth/dist/drivers/auth/bearer.esm.js';
import driverAuthBasic from '@websanova/vue-auth/dist/drivers/auth/basic.esm.js';
import driverHttpAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js';
import driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js';

import { boot } from 'quasar/wrappers';
// import axios from 'axios';
import { api } from './axios'

export default boot(({ app, router }) => {
  const auth = createAuth({
    plugins: {
      http: api,
      router: router,
    },
    drivers: {
      http: driverHttpAxios,
      auth: driverAuthBasic,
      router: driverRouterVueRouter,
    },
    options: {
      rolesKey: 'type',
      notFoundRedirect: { name: 'user-account' },
      loginData: {
        url: '/token/'
      },
      logoutData: {
        url: 'http://localhost:8000/auth/logout/'
      },
      fetchData: {
        url: 'http://localhost:8000/auth/user/'

      },
      refreshData: {
        url: '/token/',

      }
    },
  });

  app.use(auth);
});
