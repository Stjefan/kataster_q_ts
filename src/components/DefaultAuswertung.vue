<template>
  <div>My component</div>
  <q-table :rows="mittelungspegel" :hide-bottom="true" />
  <q-table :rows="anlagenpegel" :hide-bottom="true" />
  <q-table :rows="ergebnispegel" :hide-bottom="true" />
  <chart-component :pegelreihen="ergebnispegel" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { AuswertungDefault } from '../models/v1'
import ChartComponent from './ChartComponent.vue'
export default defineComponent({
  components: { ChartComponent },
  props: { 'auswertung': { type: Object as PropType<AuswertungDefault> } },
  // name: 'ComponentName'
  setup(props) {
    const mittelungspegel = computed(() => props.auswertung?.mittelungspegel)
    const anlagenpegel = computed(() => props.auswertung?.anlagenpegel)

    const ergebnispegel = computed(() => [props.auswertung?.lwlin, props.auswertung?.lwa])


    return {
      mittelungspegel,
      anlagenpegel,
      ergebnispegel
    }




  }
})
</script>
