<template>
  <q-btn label="Messwerte auswerten" @click="evaluateMesswerte" />
  <q-btn label="Bericht erstellen" @click="createExcelReport" />
  <q-tabs v-model="tab">
    <q-tab name="mails" label="Messwerte" />
    <q-tab name="auswertung" label="Auswertung" :disable="messung?.auswertung == null" />
    <q-tab name="documents" label="Dokumente" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="mails">
      <div v-for="kvp in orderedMesspositionenKvps" :key="kvp[0]">
        Messpunkte an Anlage {{ kvp[0] }}:
        <edit-messreihe :messwertereihen="kvp[1].messwertereihen" @addMesswertereihe="onAddMesswertereiheRequest"
          @removeMesswertereihe="onRemoveMesswertereiheRequest($event)" />
      </div>
      <div v-if="messung">
        Geometrische Daten der Quelle:
        <q-input v-model="messung.geometrie_emittent.geo1" type="number" label="Geo 1" />
        <q-input v-model="messung.geometrie_emittent.geo1" type="number" label="Geo 2" />
        <q-input v-model="messung.geometrie_emittent.geo1" type="number" label="Geo 3" />
        <q-input v-model="messung.geometrie_emittent.geo1" type="number" label="Geo 4" />
      </div>
      <div v-if="messung">
        Geomentrische Daten zur Messung:
        <q-input v-model="messung.geometrie_messung.geoxy" type="number" label="Geo XY" />
        <q-input v-model="messung.geometrie_messung.geoh" type="number" label="Geo H" />
        <q-input v-model="messung.geometrie_messung.komega" type="number" label="kOmega" />
        <q-input v-model="messung.geometrie_messung.k2a" type="number" label="K2A" />
      </div>
    </q-tab-panel>
    <q-tab-panel name="auswertung">
      <default-auswertung :auswertung="messung?.auswertung"></default-auswertung>
    </q-tab-panel>
    <q-tab-panel name="documents">
      <document-overview />
    </q-tab-panel>
  </q-tab-panels>


</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import EditMessreihe from './EditMessreihe.vue'
import DefaultAuswertung from './DefaultAuswertung.vue'
import { messpunktAnAnlageFactory, Messposition, messpositionFactory, messpositionEditViewModelFactory, messwertereiheDiscriminatorFactory, messungFactory, auswertungFactory, ascendingFrequences } from '../models/v1'
import DocumentOverview from './DocumentOverview.vue'
export default defineComponent({
  components: { EditMessreihe, DefaultAuswertung, DocumentOverview },
  // name: 'ComponentName'
  async setup() {
    const tab = ref('messung')
    const messung = ref(await messungFactory.build({ type: '3P' }))
    const orderedMesspositionenKvps = computed(() => Array.from(messung!.value!.messpositionen.entries()).sort(i => i[0]))
    console.log('messung', messung.value)

    console.log(messpositionFactory.build(), messpositionFactory.build())

    function onAddMesswertereiheRequest(args: unknown) {
      console.log(args)
      console.log(messung)
      messung?.value?.messpositionen.get(1)?.messwertereihen.push(messpunktAnAnlageFactory.build())
      console.log(messung?.value?.messpositionen.get(1))
      // messposition1.value.messwertereihen.push(messwertereiheDiscriminatorFactory.build({ type: "Fremdpegel" }))
    }

    function onRemoveMesswertereiheRequest(args: unknown) {
      console.log(args)
      // messposition1.value.messwertereihen.push(messwertereiheDiscriminatorFactory.build({ type: "Gesamtpegel" }))
      // messposition1.value.messwertereihen.push(messwertereiheDiscriminatorFactory.build({ type: "Fremdpegel" }))
    }

    function evaluateMesswerte() {
      messung.value!.auswertung = auswertungFactory.build()

      const messwertereihe = messung.value?.messpositionen.get(1)?.messwertereihen[0].gesamtpegel

      if (messwertereihe != null) {
        const generator = ascendingFrequences(messwertereihe)
        console.log(Array.from(generator))
        // console.log(generator.next().value)
        //console.log(generator.next().value)
      }


    }

    function createExcelReport() {
      console.log('createExcelReport')
    }
    return { orderedMesspositionenKvps, onAddMesswertereiheRequest, onRemoveMesswertereiheRequest, tab, messung, evaluateMesswerte, createExcelReport }

  }
})
</script>
