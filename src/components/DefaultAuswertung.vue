<template>
  <div>Korrekturen</div>
  {{ auswertung?.korrekturwerte }}
  <div>Winkelfehler</div>
  <div>Mittelungspegel</div>
  <q-table :rows="mittelungspegel" :hide-bottom="true" :columns="colsShared" />
  <div>Anlagenpegel</div>
  <q-table :rows="anlagenpegel" :hide-bottom="true" :columns="colsAnlagenpegel" />
  <div>LwLin / LwA</div>
  <q-table :rows="ergebnispegel" :hide-bottom="true" :columns="colsErgebnis" />
  <chart-component :pegelreihen="ergebnispegel" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { AuswertungDefault } from '../models/v1'
import ChartComponent from './ChartComponent.vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  components: { ChartComponent },
  props: { 'auswertung': { type: Object as PropType<AuswertungDefault> } },
  // name: 'ComponentName'
  setup(props) {
    const i18n = useI18n()
    const mittelungspegel_gesamt = computed(() => props.auswertung?.mittelungspegel_gesamt != null ? props.auswertung?.mittelungspegel_gesamt : [])
    const mittelungspegel_fremd = computed(() => props.auswertung?.mittelungspegel_fremd != null ? props.auswertung?.mittelungspegel_fremd : [])
    const mittelungspegel = computed(() => mittelungspegel_gesamt.value.concat(mittelungspegel_fremd.value))
    const anlagenpegel = computed(() => props.auswertung?.anlagenpegel)

    const ergebnispegel = computed(() => [props.auswertung?.lwlin, props.auswertung?.lwa])

    const colsShared = [
      {
        name: 'hz31_5',
        label: '31.5 Hz',
        // field: 'hz31_5',
        field: (i: any) => i18n.n(i.hz31_5),
      },
      {
        name: 'hz63',
        label: '63 Hz',
        //style: 'width: 50px',
        // field: 'hz63',
        field: (i: any) => i18n.n(i.hz63),
      },
      {
        name: 'hz125',
        label: '125 Hz',
        // style: 'width: 50px',
        // field: 'hz125',
        field: (i: any) => i18n.n(i.hz125),
      },
      {
        name: 'hz250',
        label: '250 Hz',
        field: (i: any) => i18n.n(i.hz250),
      },
      {
        name: 'hz500',
        label: '500 Hz',
        field: (i: any) => i18n.n(i.hz500),
      },
      {
        name: 'hz1000',
        label: '1000 Hz',
        field: (i: any) => i18n.n(i.hz1000),
      },
      {
        name: 'hz2000',
        label: '2000 Hz',
        field: (i: any) => i18n.n(i.hz2000),
      },
      {
        name: 'hz4000',
        label: '4000 Hz',
        field: (i: any) => i18n.n(i.hz4000),
      },
      {
        name: 'hz8000',
        label: '8000 Hz',
        field: (i: any) => i18n.n(i.hz8000),
      }] as any[]

    const colsAnlagenpegel = colsShared.concat([
      {
        name: 'korrektur',
        label: 'Korrektur',
        field: (i: any) => i18n.n(i.korrektur),
      },

    ])
    const colsErgebnis = colsShared.concat([
      {
        name: 'summiert',
        label: 'Summe',
        field: (i: any) => i18n.n(i.summiert)//'summiert',
      },
    ])


    return {
      colsShared,
      colsAnlagenpegel,
      colsErgebnis,
      mittelungspegel,
      anlagenpegel,
      ergebnispegel
    }




  }
})
</script>
