<template>
  <q-page padding>
    <!-- content -->
    <q-input label="Benutzer" v-model="username" />
    <q-input label="Passwort" v-model="password" type="password" />
    <q-btn label="Login" @click="login" />
    <q-btn label="Logout" @click="logout" />
  </q-page>
</template>

<script lang="ts">
import { api } from 'src/boot/axios'
import { defineComponent, ref } from 'vue'
import { errorHandler } from 'src/utility/errorHandling'
import { useAuth } from '@websanova/vue-auth';

export default defineComponent({
  // name: 'PageName'
  setup() {
    const auth = useAuth()
    const username = ref('sts')
    const password = ref('Computer0')

    function login() {
      console.log('login')
      if (false) {
        api.post('http://localhost:8000/auth/login/', {
          username: username.value,
          password: password.value
        }).then(res => console.log(res.data)).catch(errorHandler)
      }
      if (false) {
        fetch('http://localhost:8000/kataster/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ username: 'sts', password: 'Computer0' })
        }).then(res => console.log(res))
      }
      if (false) {
        api.post('/token/', { username: 'sts', password: 'Computer0' }).then(response => {
          console.log(response)
          console.log(response.headers[0])
          return api.get('http://localhost:8000/auth/user/', {
            /*
            headers: {
              'Authorization': 'Token dc55b4e46f9fa89294c5b52f7e90f4bade6c16f9'
            }
            */
          }).then(response => console.log(response))
        })
      }
      if (true) {
        auth.login({
          //   url: '/token/', //'http://localhost:8000/auth/login/'
          data: { username: 'sts', password: 'Computer0' },
        }).then(async () => {
          const r = await auth.fetch({})
          console.log('User:', auth.user(r.data))
        })
      }
      // key: 'dc55b4e46f9fa89294c5b52f7e90f4bade6c16f9' in body

    }

    function logout() {
      auth.logout({}).then(() => console.log(auth.user()))
    }

    return {
      username,
      password,
      login
      , logout
    }


  }
})
</script>
