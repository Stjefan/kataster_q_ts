<template>
  <!--
<q-select v-model="messung" :options="messungen" option-label="type" />
  -->
  <q-btn label="Messwerte auswerten" @click="evaluateMesswerte" />
  <q-btn label="Bericht erstellen" @click="createExcelReport" />
  <div>Bezeichnung Messverfahren {{ messung?.messverfahren }}</div>
  <div v-if="store.developmentMode">{{ store.messung2edit }}</div>
  <div v-if="messung">
    <q-input type="date" v-model="messung.datum" label="Messdatum" />
  </div>
  <q-tabs v-model="tab">
    <q-tab name="messwerte" label="Messwerte" />
    <q-tab name="auswertung" label="Auswertung" :disable="messung?.auswertung == null" />
    <q-tab name="documents" label="Dokumente" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="messwerte">
      <div class="row justify-evenly">
        <q-select label="Messgerät" v-model="defaultMessgeraet" class="col-2" :options="messgeraete"
          option-label="name" />
        <q-btn label="Übertragen" @click="uebetrageMessgeraet" dense class="col-1" />
        <q-input type="date" label="Messdatum" v-model="defaultMessdatum" class="col-2" />
        <q-btn label="Übertragen" @click="uebetrageMessdatum" dense class="col-1" />
        <q-select label="Overview-File" v-model="defaultOverviewfile" :options="overviews" option-label="filename"
          class="col-2" />
        <q-btn label="Übertragen" @click="uebetrageOverview" dense class="col-1" />
        <q-btn label="Messwerte auslesen" @click="uebetrageMesswerte" />
      </div>

      <div v-for="kvp in orderedMesspositionenKvps" :key="kvp[0]">
        Messpunkte an Anlage {{ kvp[0] + 1 }}:
        <edit-messreihe :messwertereihen="kvp[1].messwertereihen" @addMesswertereihe="onAddMesswertereiheRequest"
          @pasteRequest="handlePasteRequest" @removeMesswertereihe="onRemoveMesswertereiheRequest($event)" />
      </div>
      <div v-if="messung" class="row justify-between">
        <div class="col-5">
          Geometrische Daten der Quelle:
          <q-input v-model="messung.geometrie_emittent.geo1" type="number" label="Geo 1" />
          <q-input v-model="messung.geometrie_emittent.geo2" type="number" label="Geo 2" />
          <q-input v-model="messung.geometrie_emittent.geo3" type="number" label="Geo 3" />
          <q-input v-model="messung.geometrie_emittent.geo4" type="number" label="Geo 4" />
        </div>
        <div class="col-5">
          Geomentrische Daten zur Messung:
          <q-input v-model="messung.geometrie_messung.geoxy" type="number" label="Geo XY" />
          <q-input v-model="messung.geometrie_messung.geoh" type="number" label="Geo H" />
          <q-input v-model="messung.geometrie_messung.komega" type="number" label="kOmega" />
          <q-input v-model="messung.geometrie_messung.k2a" type="number" label="K2A" />
        </div>
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
import { Pegelreihe, messpunktAnAnlageFactory, messungFactory, auswertungFactory, ascendingFrequences } from '../models/v1'
import DocumentOverview from './DocumentOverview.vue'
import { berechneMittelungspegel, berechneAnlagenpegel, berechneMessflaechenkorrektur, berechneLwlin, transformZ2A } from 'src/models/berechnung'
import { useKatasterStore } from '../stores/kataster-store'
import * as _ from 'lodash'

export default defineComponent({
  components: { EditMessreihe, DefaultAuswertung, DocumentOverview },
  // name: 'ComponentName'
  async setup() {
    const store = useKatasterStore()
    const tab = ref('messwerte')
    const messgeraete = computed(() => store.messgeraete)
    const overviews = computed(() => store.overviews)
    const defaultMessgeraet = ref(store.messgeraete.length > 0 ? store.messgeraete[0] : null)
    const defaultMessdatum = ref('2023-01-02')
    const defaultOverviewfile = ref(store.overviews.length ? store.overviews[0] : null)
    const correspondingEmitten = computed(() => store.emittent)

    const messungen = ref(
      store.emittent?.messungen != null ? store.emittent?.messungen : []
      // [await messungFactory.build({ type: '3P' }), await messungFactory.build({ type: '1P' }), await messungFactory.build({ type: '4P' }), await messungFactory.build({ type: '5P' })]
    )
    const messung = computed(() => store.messung2edit)
    const orderedMesspositionenKvps = computed(() => Array.from(messung!.value!.messpositionen.entries()).sort(i => i[0]))
    console.log('messung', messung.value)


    function onAddMesswertereiheRequest(args: unknown) {
      console.log(args)
      console.log(messung)
      messung?.value?.messpositionen[0]?.messwertereihen.push(messpunktAnAnlageFactory.build())
      console.log(messung?.value?.messpositionen[0])
      // messposition1.value.messwertereihen.push(messwertereiheDiscriminatorFactory.build({ type: "Fremdpegel" }))
    }

    function onRemoveMesswertereiheRequest(args: unknown) {
      console.log(args)
      const target = messung.value?.messpositionen[0]
      if (target != null) {

        const idx = target.messwertereihen.findIndex(i => i.id == args)
        target.messwertereihen.splice(idx, 1)
      }

      // messposition1.value.messwertereihen.push(messwertereiheDiscriminatorFactory.build({ type: "Gesamtpegel" }))
      // messposition1.value.messwertereihen.push(messwertereiheDiscriminatorFactory.build({ type: "Fremdpegel" }))
    }

    function uebetrageMessgeraet() {
      if (messung.value != null) {
        for (const k of messung.value.messpositionen.keys()) {
          const val = messung.value.messpositionen[k]
          if (val != null) {

            for (const mp of val.messwertereihen) {
              mp.metainfoFremdpegel.messgeraet = defaultMessgeraet.value?.name
              mp.metainfoGesamtpegel.messgeraet = defaultMessgeraet.value?.name
            }
          }

        }
      }


    }

    function uebetrageOverview() {
      if (messung.value != null) {
        for (const k of messung.value.messpositionen.keys()) {
          const val = messung.value.messpositionen[k]
          if (val != null && defaultOverviewfile.value != null) {

            for (const mp of val.messwertereihen) {
              mp.metainfoFremdpegel.overviewfile = defaultOverviewfile.value.id
              mp.metainfoGesamtpegel.overviewfile = defaultOverviewfile.value.id
            }
          }

        }
      }


    }


    function uebetrageMessdatum() {
      if (messung.value != null) {
        for (const k of messung.value.messpositionen.keys()) {
          const val = messung.value.messpositionen[k]
          if (val != null) {

            for (const mp of val.messwertereihen) {
              mp.metainfoFremdpegel.messdatum = defaultMessdatum.value
              mp.metainfoGesamtpegel.messdatum = defaultMessdatum.value
            }
          }

        }
      }


    }

    function handlePasteRequest(args: any) {
      console.log(args)
      const dummy = {
        hz31_5: 60,
        hz63: 63,
        hz125: 66,
        hz250: 69,
        hz500: 72,
        hz1000: 75,
        hz2000: 78,
        hz4000: 81,
        hz8000: 84
      }
      const dummy_fremd = {
        hz31_5: 60 - 3,
        hz63: 63 - 3,
        hz125: 66 - 4,
        hz250: 69 - 5,
        hz500: 72 - 6,
        hz1000: 75 - 6,
        hz2000: 78 - 7,
        hz4000: 81 - 2,
        hz8000: 84 - 3
      }
      switch (args.args) {
        case 'gesamtpegel':
          /*
          args.sender.hz31_5 = dummy.hz31_5
          args.sender.hz63 = dummy.hz63
          args.sender.hz125 = dummy.hz125
          args.sender.hz250 = dummy.hz250
          */
          Object.assign(args.sender, dummy)
          break;
        case 'fremdpegel':
          Object.assign(args.sender, dummy_fremd)
      }

    }

    function uebetrageMesswerte() {
      if (messung.value != null) {
        for (const k of messung.value.messpositionen.keys()) {
          const val = messung.value.messpositionen[k]
          if (val != null) {
            const p = { hz31_5: 100 } as Pegelreihe

            for (const mp of val.messwertereihen) {
              mp.gesamtpegel = { ...mp.gesamtpegel, ...p }
              mp.fremdpegel = { ...mp.fremdpegel, ...p }
              // mp.metainfoFremdpegel.messdatum = defaultMessdatum.value
              // mp.metainfoGesamtpegel.messdatum = defaultMessdatum.value
            }
          }

        }
      }


    }


    function evaluateMesswerte() {


      if (messung.value != null) {


        const korrektur = berechneMessflaechenkorrektur(messung.value?.geometrie_emittent, messung.value?.geometrie_messung, messung.value?.messverfahren)
        const auswertung = auswertungFactory.build()
        const anlagenpegel_alle_messpositionen = []
        const mittelungspegel_gesamt_alle_messpositionen = []
        const mittelungspegel_fremd_alle_messpositionen = []

        console.log('korrektur', korrektur)

        for (let i = 0; i < messung.value?.messpositionen.length; i++) {
          const m = messung.value?.messpositionen[i]

          const m_quer = berechneMittelungspegel(m)
          console.log('m_quer', m_quer)
          const a = berechneAnlagenpegel(m, korrektur.korrekturen[i])
          a.korrektur = korrektur.korrekturen[i]
          anlagenpegel_alle_messpositionen.push(a)
          mittelungspegel_gesamt_alle_messpositionen.push(m_quer.gesamtpegel)
          if (m_quer.fremdpegel != null) {
            mittelungspegel_fremd_alle_messpositionen.push(m_quer.fremdpegel)
          }


        }


        console.log('gesamtanlagenpegel', anlagenpegel_alle_messpositionen)

        const lwlin = berechneLwlin(anlagenpegel_alle_messpositionen)
        console.log('lwlin', lwlin)
        const lwa = transformZ2A(lwlin)
        console.log('lwa', lwa)

        auswertung.mittelungspegel_gesamt = mittelungspegel_gesamt_alle_messpositionen
        auswertung.mittelungspegel_fremd = mittelungspegel_fremd_alle_messpositionen
        auswertung.anlagenpegel = anlagenpegel_alle_messpositionen
        auswertung.lwlin = lwlin
        auswertung.lwa = lwa

        messung.value.auswertung = auswertung


      }

    }

    function createExcelReport() {
      console.log('createExcelReport')
    }
    return {
      uebetrageOverview,
      uebetrageMesswerte,
      uebetrageMessdatum, uebetrageMessgeraet, messgeraete, orderedMesspositionenKvps, onAddMesswertereiheRequest,
      onRemoveMesswertereiheRequest, tab, messung, evaluateMesswerte, createExcelReport,
      messungen, defaultMessgeraet, defaultMessdatum, store, defaultOverviewfile,
      handlePasteRequest,
      overviews,
    }

  }
})
</script>
