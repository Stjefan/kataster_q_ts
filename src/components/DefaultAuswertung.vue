<template>
  <div>My component</div>
  <q-table :rows="mittelungspegel" :hide-bottom="true" />
  <q-table :rows="anlagenpegel" :hide-bottom="true" />
  <q-table :rows="ergebnispegel" :hide-bottom="true" />
  <div>???</div>
  {{ auswertung }}
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { AuswertungDefault } from '../models/v1'
export default defineComponent({
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
