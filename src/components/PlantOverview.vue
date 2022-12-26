<template>
  <q-tree ref="uebersichtTree" node-key="id" :nodes="uebersichtTreeNodes" label-key="name" children-key="children"
    v-model:selected="selectedKey">
    <template v-slot:header-emittent="props">
      <div>
        {{ props.node.name }}
        <q-menu touch-position context-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="remove(props.node)">
              <q-item-section>Löschen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="doRouterPush(props.node.id)">
              <q-item-section>Bearbeiten</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="editEmittentDialog(props.node)">
              <q-item-section>Auf Karte markieren</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </template>
    <template v-slot:header-dach="props">
      <div>
        {{ props.node.name }}
        <q-menu touch-position context-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="createEntityDialog(props.node)">
              <q-item-section>Emittent hinzufügen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="editEntityDialog(props.node)">
              <q-item-section>Bearbeiten</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="showMap(props.node)" :disable="props.node.map == null">
              <q-item-section>Karte anzeigen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="editMap(props.node)">
              <q-item-section>Karte erstellen / bearbeiten</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="remove(props.node)">
              <q-item-section>Löschen</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </template>
    <template v-slot:header-gebaeude="props">
      <div>
        {{ props.node.name }}
        <q-menu touch-position context-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="editEntityDialog(props.node)">
              <q-item-section>Bearbeiten</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="createEntityDialog(props.node)">
              <q-item-section>Dach hinzufügen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="remove(props.node)">
              <q-item-section>Löschen</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </template>
    <template v-slot:header-werk="props">
      <div>
        {{ props.node.name }}
        <q-menu touch-position context-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="editEntityDialog(props.node)">
              <q-item-section>Bearbeiten</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="createEntityDialog(props.node)">
              <q-item-section>Gebaeude hinzufügen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup :disable="props.node.map == null" @click="showMap(props.node)">
              <q-item-section>Karte anzeigen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="remove(props.node)">
              <q-item-section>Löschen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="editMap(props.node)">
              <q-item-section>Karte erstellen / bearbeiten</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </template>
  </q-tree>
</template>

<script lang="ts">
import { api } from 'src/boot/axios'
import { Building, Emittent, Plant, Roof } from 'src/models/v1'
import { defineComponent, ref } from 'vue'
import * as _ from 'lodash'
export default defineComponent({
  // name: 'ComponentName'
  props: ['uebersichtTreeNodes'],
  setup(props, { emit }) {

    const expanded = ref([])
    const selectedKey = ref('')
    // const myNodes = ref([])
    function createEntityDialog(_args: unknown) {
      console.log('This is a filler...', _args)
      emit('createChild', _args)
    }

    function editEmittentDialog(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function editEntityDialog(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function doRouterPush(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function editMap(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function showMap(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function remove(target: Plant | Building | Roof | Emittent) {
      console.log('This is a filler...', target)

      if (target.body == 'werk') {
        props.uebersichtTreeNodes.findIndex((i: Plant) => i.id === target.id)

        /*
        api
          .delete(`/kataster/werk/${target.id}`)
          .then((response) => console.log(response));
          */
      } else if (target.body == 'gebaeude') {
        const allBuildings = _.flatMap(props.uebersichtTreeNodes, (i: Plant) => i.children)

        console.log(allBuildings)
        /*
        api
          .delete(`/kataster/building/${target.id}`)
          .then((response) => console.log(response));
          */
      } else if (target.body == 'dach') {
        /*
        api
          .delete(`/kataster/roof/${target.id}`)
          .then((response) => console.log(response));
          */
      } else if (target.body == 'emittent') {
        /*
        api
          .delete(`/kataster/emittent/${target.id}`)
          .then((response) => console.log(response));
          */
      }


    }

    return {
      expanded,
      selectedKey,
      editEntityDialog,
      editEmittentDialog,
      doRouterPush,
      createEntityDialog,
      editMap,
      showMap,
      remove
    }
  }
})
</script>
