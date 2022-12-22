<template>
  <q-page padding>
    <!-- content -->
    <q-btn label="Neues Werk  " @click="init" />
    <plant-overview :uebersichtTreeNodes="treeNodes" @createChild="create" />
  </q-page>
</template>

<script lang="ts">
import { Building, Plant, Roof, plantFactory, roofFactory, buildingFactory, emittentFactory } from '../models/v1'

import { computed, defineComponent, ref, Ref } from 'vue'
import PlantOverview from '../components/PlantOverview.vue'

import { useKatasterStore } from '../stores/kataster-store'
export default defineComponent({
  // name: 'PageName'
  components: { PlantOverview },
  setup() {
    const store = useKatasterStore()
    const treeNodes = computed(() => store.plants)
    function init() {
      store.$patch((state) => {
        state.plants.push(plantFactory.build())
      })
      // treeNodes.value.push(plantFactory.build())

    }
    function create(_args: Plant | Building | Roof) {
      console.log(_args)
      switch (_args.body) {
        case 'werk':
          console.log('werk');
          _args.children.push(buildingFactory.build())
          break;
        case 'dach':
          console.log('dach');
          (_args as Roof).children.push(emittentFactory.build())
          break;
        case 'gebaeude':
          console.log('gebaeude');
          (_args as Building).children.push(roofFactory.build())
          break;

      }

    }
    return {
      init,
      create,
      treeNodes
    }
  }
})
</script>
