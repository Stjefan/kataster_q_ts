<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="blabla" />

        <q-toolbar-title>
          <!--Kataster App-->
        </q-toolbar-title>
        <div>{{ auth.user()?.username }}</div>
        <q-btn v-if="auth.user()" label="Logout" @click="logout()" flat />

        <div v-if="false">Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-tabs no-caps>
        <!--<q-route-tab :to="{ name: 'mapper' }" exact label="Mapper" />-->

        <!--<q-route-tab :to="{ name: 'login' }" exact label="Login" />-->
        <q-route-tab to="pouch" label="Pouch" />
        <q-route-tab :to="{ name: 'projects' }" exact label="Projekte" />
        <!--
        <q-route-tab :to="{ name: 'sts' }" exact label="STS" />
-->
        <q-route-tab :to="{ name: 'uebersicht' }" exact label="Übersicht" />


        <q-route-tab :to="{ name: 'vorlagen' }" exact label="Vorlagen" />
        <q-route-tab :to="{ name: 'messgeraete' }" exact label="Messgeräte" />
        <q-route-tab :to="{ name: 'overviews' }" exact label="Overviews" />

        <q-route-tab :to="{ name: 'filter' }" exact label="Filter" />

        <q-route-tab to="map" exact label="Karte" :disable="store.karte2edit == null" />

        <q-route-tab to="emittent" exact label="Emittent" :disable="store.emittent == null" />
        <!--
        <q-tab @click="blabla" label="Auth" />
-->
      </q-tabs>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mapper } from '../mappings/mapper'
import { useKatasterStore } from 'src/stores/kataster-store';
import { useAuth } from '@websanova/vue-auth';
import {
  messwertereiheFactory, Pegelreihe, Messung,
  messungFactory,
} from '../models/v1'
import { Pegelreihe as PegelreiheAPI, MesspositionPegelreiheSerializerV2 } from '../models/api'

const store = useKatasterStore()

const auth = useAuth()

const source = messwertereiheFactory.build()
console.log('Mapping...', source)
const result = mapper.map<Pegelreihe, PegelreiheAPI>(source, 'Pegelreihe', 'PegelreiheAPI')
console.log(result)

console.log('And back...', mapper.map<PegelreiheAPI, Pegelreihe>(result, 'PegelreiheAPI', 'Pegelreihe'))
const leftDrawerOpen = ref(false)

async function blabla() {
  // auth.login({
  //   url: 'http://localhost:8000/auth/login/',
  //   data: { username: 'sts', password: 'Computer0' },
  //   fetchUser: false
  // }).then(res => console.log(res))

}

function logout() {
  auth.logout({}).then(() => console.log(auth.user()))
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
