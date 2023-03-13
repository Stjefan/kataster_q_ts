<template>
  <q-input label="Bezeichnung" :model-value="name" @update:model-value="$emit('update:name', $event)" />
  <div>Angaben zum Emittent</div>
  <div>Angaben zur Messung</div>
  <div>Angaben zur Auswertung</div>
  <q-btn label="Vorlage löschen" @click="$emit('remove')" />
  <q-btn label="Änderungen speichern" @click="$emit('save')" />
  <q-btn label="TEST" @click="test" />
  <q-btn label="Erstellen" @click="create" />
</template>

<script lang="ts">
import { api } from 'src/boot/axios'
import { defineComponent } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';
import { emittentDetailsFactory, messungFactory, auswertungFactory, ascendingFrequences, Messung, MesspunktAnAnlage, Emittent, EmittentDetails, Building, messpositionEditViewModelFactory, vorlageFactory } from 'src/models/v1';

import { useKatasterStore } from 'src/stores/kataster-store';
export default defineComponent({
  // name: 'ComponentName'
  props: ['name'],
  setup() {
    const store = useKatasterStore()

    const emittent = emittentDetailsFactory.build()

    async function create() {
      store.createExcelTemplateBackend(vorlageFactory.build())
    }

    async function test() {

      const p0 = store.plants[0]
      const g0 = store.plants[0].children[0]
      const d0 = store.plants[0].children[0].children[0]

      const messung = await messungFactory.build({ type: '4P' })
      messung?.messpositionen.push(messpositionEditViewModelFactory.build())
      messung?.messpositionen.push(messpositionEditViewModelFactory.build())

      const auswertung = auswertungFactory.build()





      console.log('createExcel');
      api
        .get('http://localhost:8080/13135EZW-SQKataster_EXCEL-Master.xlsx', {
          responseType: 'arraybuffer',
        })
        .then(async (doc) => {
          console.log(doc);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(doc.data);
          const sheet = workbook.addWorksheet('My Sheet');

          const getters = [
            { getter: (i: Messung) => i.geometrie_emittent.geo1, row: 1, col: 1 },
            { getter: (i: Messung) => i.geometrie_emittent.geo2, row: 2, col: 1 },
            { getter: (i: Messung) => i.geometrie_emittent.geo3, row: 3, col: 1 },
            { getter: (i: Messung) => i.geometrie_emittent.geo4, row: 4, col: 1 },
            { getter: (i: Messung) => i.geometrie_messung.geoxy, row: 5, col: 1 },
            { getter: (i: Messung) => i.geometrie_messung.geoh, row: 6, col: 1 },
            { getter: (i: Messung) => i.geometrie_messung.k2a, row: 7, col: 1 },
            { getter: (i: Messung) => i.geometrie_messung.komega, row: 8, col: 1 },
            { getter: (i: Messung) => i.messverfahren, row: 9, col: 1 },
            /*
            (i: Messung) => i.auswertung?.lwlin,
            (i: Messung) => i.auswertung?.lwa,
            (i: Messung) => i.auswertung?.anlagenpegel[0].korrektur
            */

          ]



          const getters_auswertungspegel = [
            (i: Messung) => i.auswertung?.lwlin,
            (i: Messung) => i.auswertung?.lwa,
          ]




          const gettersBuilding = [
            (i: Building) => i.name
          ]
          const gettersEmittent = [
            (i: EmittentDetails) => i.name,
            (i: EmittentDetails) => i.gkrechts,
            (i: EmittentDetails) => i.gkhoch,
            (i: EmittentDetails) => i.hoehe,
          ]

          let getterCounter = 0

          if (messung != null) {

            for (const g of getters) {
              sheet.getCell(15 + g.row, g.col).value = g.getter(messung)

              // getterCounter++

            }
          }


          sheet.getCell(1, 1).value = emittent.name
          if (messung != null) {
            const prop = [(i: MesspunktAnAnlage) => i.gesamtpegel, (i: MesspunktAnAnlage) => i.fremdpegel]
            for (const kvp of messung.messpositionen.entries()) {
              let counter = 1
              let propCounter = 0
              for (const p of prop) {


                for (const f of ascendingFrequences(p(kvp[1].messwertereihen[0]))) {
                  console.log(f)
                  sheet.getCell(1 + kvp[0] + propCounter, counter).value = f
                  counter++
                }
                propCounter++
              }
            }
          }

          const buf = await workbook.xlsx.writeBuffer();

          store.$patch(state => state.reports.push(new Blob([buf])))

          console.log(store.reports)

          // saveAs(new Blob([buf]), 'Test_1234.xlsx');
        });
    }


    return {
      test,
      create
    }
  }

})
</script>
