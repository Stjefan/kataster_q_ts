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
import { Building, buildingFactory, Emittent, emittentFactory, Plant, pointOnMapFactory, Roof, roofFactory } from 'src/models/v1'
import { defineComponent, ref } from 'vue'
import * as _ from 'lodash'
import { useKatasterStore } from 'src/stores/kataster-store'
import { useQuasar } from 'quasar';
export default defineComponent({
  // name: 'ComponentName'
  props: ['uebersichtTreeNodes'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useKatasterStore()

    const expanded = ref([])
    const selectedKey = ref('')
    // const myNodes = ref([])
    function createEntityDialog(_args: Plant | Building | Roof) {
      $q.dialog({
        title: 'Anlegen',
        message: `${_args.header} ${_args.name} bearbeiten`,
        cancel: true,
        persistent: true,
        options: {
          model: 'opt1',
          // inline: true
          items: [
            { label: '1 Anlage', value: 'opt1', color: 'secondary' },
            { label: '3 Anlagen', value: 'opt3' },
            { label: '4 Anlagen', value: 'opt4' },
            { label: '5 Anlagen', value: 'opt5' }
          ]
        }
      }).onOk(async (data) => {
        console.log(data);
        switch (_args.body) {
          case 'werk':
            (_args as Plant).children.push(buildingFactory.build())
            break
          case 'gebaeude':
            (_args as Building).children.push(roofFactory.build())
            break
          case 'dach':
            (_args as Roof).children.push(emittentFactory.build())
            break
        }



      })
    }

    function editEmittentDialog(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function editEntityDialog(_args: Plant | Building | Roof) {
      $q.dialog({
        title: 'Editiere',
        message: `${_args.header} ${_args.name} bearbeiten`,
        cancel: true,
        persistent: true,
        options: {
          model: 'opt1',
          // inline: true
          items: [
            { label: '1 Anlage', value: 'opt1', color: 'secondary' },
            { label: '3 Anlagen', value: 'opt3' },
            { label: '4 Anlagen', value: 'opt4' },
            { label: '5 Anlagen', value: 'opt5' }
          ]
        }
      }).onOk(async (data) => {
        console.log(data);



      })

    }

    function doRouterPush(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function editMap(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function showMap(_args: Plant | Roof) {
      console.log('This is a filler...', _args)
      store.$patch({
        karteMainPage: _args.map
      })
      switch (_args.body) {
        case 'dach':
          console.log()
          store.$patch({
            pointsOnMap: (_args as Roof).children.map(i => pointOnMapFactory.build({ pixel_x: i.koordinaten.pixel_x, pixel_y: i.koordinaten.pixel_y }))
          })
          break;
        case 'werk':
          console.log((_args as Plant).children.map(i => i.children.map(ii => ii.map)))
          break;

      }

    }

    function remove(target: Plant | Building | Roof | Emittent) {

      console.log('This is a filler...', target)

      if (target.body == 'werk') {
        const parentPlant = props.uebersichtTreeNodes.findIndex((i: Plant) => i.id === target.id)

        console.log(parentPlant)



        /*
        api
          .delete(`/kataster/werk/${target.id}`)
          .then((response) => console.log(response));
          */
      } else if (target.body == 'gebaeude') {

        const parentPlant = props.uebersichtTreeNodes.findIndex((i: Plant) => i.children.findIndex((ii: Building) => ii.id === target.id) != -1)

        console.log(parentPlant)

        const parentBuilding = props.uebersichtTreeNodes[parentPlant].children.findIndex((ii: Building) => ii.id === target.id)

        console.log(parentBuilding)


        /*
        api
          .delete(`/kataster/building/${target.id}`)
          .then((response) => console.log(response));
          */
      } else if (target.body == 'dach') {
        const parentPlant = props.uebersichtTreeNodes.findIndex((i: Plant) => i.children.findIndex((ii: Building) => ii.children.findIndex(iii => iii.id === target.id) != -1) != -1)

        console.log(parentPlant)

        const parentBuilding = props.uebersichtTreeNodes[parentPlant].children.findIndex((ii: Building) => ii.children.findIndex(iii => iii.id === target.id) != -1)

        console.log(parentBuilding)

        const parentRoof = props.uebersichtTreeNodes[parentPlant].children[parentBuilding].children.findIndex((iii: Roof) => iii.id === target.id)

        console.log(parentRoof)


        /*
        api
          .delete(`/kataster/roof/${target.id}`)
          .then((response) => console.log(response));
          */
      } else if (target.body == 'emittent') {
        const parentPlant = props.uebersichtTreeNodes.findIndex((i: Plant) => i.children.some((ii: Building) => ii.children.some((iii: Roof) => iii.children.some(iv => iv.id === target.id))))

        console.log(parentPlant)

        const parentBuilding = props.uebersichtTreeNodes[parentPlant].children.findIndex((ii: Building) => ii.children.some((iii: Roof) => iii.children.some(iv => iv.id === target.id)))

        console.log(parentBuilding)

        const parentRoof = props.uebersichtTreeNodes[parentPlant].children[parentBuilding].children.findIndex((iii: Roof) => iii.children.some(iv => iv.id === target.id))

        console.log(parentRoof)

        const parentEmittent = props.uebersichtTreeNodes[parentPlant].children[parentBuilding].children[parentRoof].children.findIndex((iii: Emittent) => iii.id === target.id)

        console.log(parentEmittent)
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
