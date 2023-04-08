<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <q-scroll-area style="height: 70vh;" class="col-3">
        <q-btn label="Neues Werk  " @click="init" />

        <br />
        <q-btn icon="autorenew" @click="refresh" />
        <br />
        <q-btn label="Import" @click="store.loadJson" />
        <q-btn label="Replicate" @click="store.replicateDatabase" />
        <!--
        <q-btn label="Pouch-Fun" @click="store.funWithPouch" />
        <q-btn label="Filter" @click="store.filterWithPouch" />
        <q-btn label="Baumstruktur" @click="store.funWithBaumstruktur" />
        <q-btn label="Baum-Read" @click="store.funWithBaumRead" />
        <q-btn label="Destroy-Pouch" @click="store.destroyPouch" />
        <q-btn label="Backup" @click="store.funWithBackup" />
        <q-btn label="funWithAttachment" @click="store.funWithAttachment" />
        <q-btn label="loadMap" @click="store.loadMapFromPouch" />
        -->
        <plant-overview :uebersichtTreeNodes="treeNodes" @createChildDialog="createEntityDialog" @removeNode="remove"
          v-model:expanded="treeNodesExpanded" />
      </q-scroll-area>
      <div class="col-8">

        <map-view @addEmittent="handleAddEmittent" @selectNodeRequest="handleSelectNodeRequest" v-if="store.karteMainPage"
          style="height: 70vh" />
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import { Building, Plant, Roof, plantFactory, roofFactory, buildingFactory, emittentFactory, Emittent, Koordinaten, koordinatenFactory } from '../models/v1'

import { computed, defineComponent, ref, Ref } from 'vue'
import PlantOverview from '../components/PlantOverview.vue'

import { useKatasterStore } from '../stores/kataster-store'
import MapView from 'src/components/MapView.vue'
import { useQuasar } from 'quasar'
export default defineComponent({
  // name: 'PageName'
  components: { PlantOverview, MapView },
  setup() {

    const $q = useQuasar()
    const store = useKatasterStore()
    if (store.project == null) throw new Error('Invalid arguments')
    const treeNodes = computed(() => store.plants)

    const treeNodesExpanded = computed({
      get: () => store.expandedTreeNodes, set: (val) => store.$patch({ expandedTreeNodes: val })
    })

    async function refresh() {
      if (store.project != null) {
        await store.changeProject(store.project)
        treeNodesExpanded.value = []
      }

    }
    function init() {
      /*
      store.$patch((state) => {
        state.plants.push(plantFactory.build({ project_id: 1 }))
      })
      */
      // store.createPlantBackend(plantFactory.build({ project_id: 6 }))
      // treeNodes.value.push(plantFactory.build())
      $q.dialog({
        title: 'Bezeichnung eingeben',
        message: 'Name',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk((data: string) => {
        // console.log('>>>> OK, received', data)
        console.log(data)
        store.createPlantBackend(plantFactory.build({ name: data }))
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
    function create(_args: any) {

      console.log(_args, _args.data.koordinaten)

      switch (_args.target.body) {
        case 'werk':
          console.log('werk');
          store.createBuildingBackend(buildingFactory.build({ parent: `${_args.target.id}`, name: _args.data.name }), _args.target.id)

          break;
        case 'dach':
          console.log('dach');
          store.createEmittentBackend(emittentFactory.build({ parent: `${_args.target.id}`, name: _args.data.name, koordinaten: _args.data.koordinaten ?? koordinatenFactory.build() }), _args.target.id)

          // (_args as Roof).children.push(emittentFactory.build({ parent: _args.id }))
          break;
        case 'gebaeude':
          console.log('gebaeude');
          store.createRoofBackend(roofFactory.build({ parent: `${_args.target.id}`, name: _args.data.name }), _args.target.id)
          break;

      }

    }

    function createEntityDialog(parent: any, furtherArgs: any) {
      $q.dialog({
        title: 'Bezeichnung eingeben',
        message: 'Name',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk((data) => {
        console.log(data);
        const k = furtherArgs as Koordinaten
        const p = parent as Roof
        if (p.map?.georeferenzierung != null) {
          console.log('I ve a georefernezierung')
        }

        create({ target: parent, data: { name: data, ...furtherArgs } })


      })
    }



    function handleAddEmittent(args: unknown) {
      console.log(args)
      createEntityDialog(store.karteMainPageZuordnung, args)
    }

    function handleSelectNodeRequest(args: unknown) {
      console.log(args)
    }

    function remove(node: Plant | Roof | Building | Emittent) {
      switch (node.body) {
        case 'werk':
          store.removePlantBackend(node as Plant)
          break
        case 'dach':
          store.removeRoofBackend(node as Roof)
          break;
        case 'emittent':
          store.removeEmittentBackend(node as Emittent)
          break;
        case 'gebaeude':
          store.removeBuildingBackend(node as Building)
      }

    }
    return {
      init,
      create,
      remove,
      treeNodes,
      refresh,
      treeNodesExpanded,
      handleAddEmittent,
      createEntityDialog,
      store,
      handleSelectNodeRequest
    }
  }
})
</script>
