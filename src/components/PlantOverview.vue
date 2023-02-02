<template>
  <q-tree ref="uebersichtTree" node-key="id" :nodes="uebersichtTreeNodes" label-key="name" children-key="children"
    v-model:selected="selectedKey">
    <template v-slot:header-emittent="props">
      <div style="width: 200px">
        {{ props.node.name }}
        <q-menu touch-position context-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="remove(props.node)">
              <q-item-section>Löschen</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="editEmittentDialog(props.node)">
              <q-item-section>Bearbeiten</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="markOnMap(props.node)">
              <q-item-section>Auf Karte markieren</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </template>
    <template v-slot:header-dach="props">
      <div style="width: 200px">
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
      <div style="width: 200px">
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
      <div style="width: 200px">
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
import { Building, buildingFactory, Emittent, emittentFactory, karteDetailsFactory, Plant, pointOnMapFactory, rectOnMapFactory, Roof, roofFactory } from 'src/models/v1'
import { defineComponent, ref } from 'vue'
import { gk_2_px, get_gk_2_px_matrix } from 'src/utility/georeferenzieren'
import * as _ from 'lodash'
import { useKatasterStore } from 'src/stores/kataster-store'
import { useQuasar } from 'quasar';

function getMessageText(node: Roof | Building | Plant) {
  switch (node.body) {
    case 'werk':
      return `Werk ${node.name} bearbeiten`
    case 'dach':
      return `Dach ${node.name} bearbeiten`
    case 'gebaeude':
      return `Gebäude ${node.name} bearbeiten`
  }
}
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
      emit('create-child-dialog', _args)
    }

    async function editEmittentDialog(_args: Emittent) {
      console.log('This is a filler...', _args)
      await store.setEmittentDetailsFromEmittent(_args)
      console.log('Store should have done its work')
    }

    function editEntityDialog(_args: Plant | Building | Roof) {
      $q.dialog({
        title: 'Editiere',
        message: getMessageText(_args),
        cancel: true,
        persistent: true,
        prompt: {
          model: '',
          type: 'text' // optional
        },
      }).onOk(async (data) => {
        console.log(data);
        _args.name = data
        switch (_args.body) {
          case 'werk':
            store.updatePlantBackend(_args as Plant)
            break;
          case 'dach':
            throw Error('Not implemented')
            break;
          case 'gebaeude':
            store.updateBuildingBackend(_args as Building)
            break;

        }



      })

    }

    function doRouterPush(_args: unknown) {
      console.log('This is a filler...', _args)
    }

    function editMap(_args: Plant | Roof) {
      console.log('This is a filler...', _args)
      if (_args.map != null) {
        store.$patch({
          karte2edit: _args.map,
          karte2editZuordnung: _args,
        })
      } else {
        store.$patch({
          karte2edit: karteDetailsFactory.build(),
          karte2editZuordnung: _args
        })
      }
    }

    function showMap(_args: Plant | Roof) {
      console.log('This is a filler...', _args)
      store.showMap(_args)
      switch (_args.body) {
        case 'dach':

          if (_args.map.georeferenzierung) {
            const mygk2pxMatrix = get_gk_2_px_matrix(_args.map.georeferenzierung)

            store.$patch({
              pointsOnMap: (_args as Roof).children.filter(i => i.koordinaten != null).map(i => {
                const p = gk_2_px(i.koordinaten, mygk2pxMatrix)
                return pointOnMapFactory.build({ pixel_x: p.px_x, pixel_y: p.px_y, idCorrespondingEmittent: parseInt(i.id) })
              })
            })
            console.log(store.pointsOnMap)
          }


          break;
        case 'werk':
          console.log((_args as Plant).children.map(i => i.children.map(ii => ii.map)))
          const roofs = _.flatMap((_args as Plant).children, i => i.children)
          if (_args.map.georeferenzierung) {
            const mygk2pxMatrix = get_gk_2_px_matrix(_args.map.georeferenzierung)

            store.$patch({
              rectsOnMap: roofs.filter(i => i.map != null && i.map.georeferenzierung != null).map(i => {
                const p_ll = gk_2_px(i.map.georeferenzierung!.lower_left, mygk2pxMatrix)
                const p_lr = gk_2_px(i.map.georeferenzierung!.lower_right, mygk2pxMatrix)
                const p_ur = gk_2_px(i.map.georeferenzierung!.upper_right, mygk2pxMatrix)
                const p_ul = gk_2_px(i.map.georeferenzierung!.upper_left, mygk2pxMatrix)
                const r = rectOnMapFactory.build()
                r.points = `${Math.floor(p_ll.px_x)}, ${Math.floor(p_ll.px_y)},
              ${Math.floor(p_lr.px_x)}, ${Math.floor(p_lr.px_y)},
              ${Math.floor(p_ur.px_x)}, ${Math.floor(p_ur.px_y)},
              ${Math.floor(p_ul.px_x)}, ${Math.floor(p_ul.px_y)}`
                r.idCorrespondingRoof = i.idAtBackend
                r.nameCorrespondingRoof = i.name
                return r
              })
            })
          }
          break;

      }

    }

    function markOnMap(target: Emittent) {
      console.log(target)
    }

    function remove(target: Plant | Building | Roof | Emittent) {



      emit('remove-node', target)

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
      remove,
      markOnMap
    }
  }
})
</script>
