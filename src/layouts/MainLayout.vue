<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="blabla" />

        <q-toolbar-title>
          <!--Kataster App-->
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-tabs no-caps>

        <q-route-tab :to="{ name: 'login' }" exact label="Login" />
        <q-route-tab :to="{ name: 'projects' }" exact label="Projekte" />

        <q-route-tab :to="{ name: 'sts' }" exact label="STS" />

        <q-route-tab :to="{ name: 'uebersicht' }" exact label="Übersicht" />


        <q-route-tab :to="{ name: 'vorlagen' }" exact label="Vorlagen" />
        <q-route-tab :to="{ name: 'messgeraete' }" exact label="Messgeräte" />

        <q-route-tab :to="{ name: 'filter' }" exact label="Filter" />

        <q-route-tab to="map" exact label="Karte" />

        <q-route-tab to="emittent" exact label="Emittent" />

      </q-tabs>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mapper } from '../mappings/mapper'

import {
  messwertereiheFactory, Pegelreihe, Messung, messwertereiheDiscriminatorFactory,
  messungFactory,
  MesswertreiheDiscriminator
} from '../models/v1'
import { Pegelreihe as PegelreiheAPI, MesspositionPegelreiheSerializerV2 } from '../models/api'

const source = messwertereiheFactory.build()
console.log('Mapping...', source)
const result = mapper.map<Pegelreihe, PegelreiheAPI>(source, 'Pegelreihe', 'PegelreiheAPI')
console.log(result)

console.log('And back...', mapper.map<PegelreiheAPI, Pegelreihe>(result, 'PegelreiheAPI', 'Pegelreihe'))
const leftDrawerOpen = ref(false)

async function blabla() {
  if (false) {
    const source = await messungFactory.build({ type: '1P' })
    if (source != null) {
      console.log(source)
      console.log('And another...', mapper.map<Messung, Messung>(
        source, 'Messung', 'Messung'))
    }
  }
  const source = messwertereiheDiscriminatorFactory.build()
  console.log(source)

  const result = mapper.map<MesswertreiheDiscriminator & Pegelreihe, MesspositionPegelreiheSerializerV2>(source, 'MesswertreiheDiscriminator', 'MesspositionPegelreiheSerializerV2')
  console.log(result)

}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
