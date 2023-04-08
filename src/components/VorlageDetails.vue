<template>
  <q-select v-model="vorlage" :options="vorlagen" option-label="name" />
  <div v-if="vorlage">
    <q-input v-model="vorlage.name" label="Name" />
    <q-btn label="Feld hinzufügen" @click="addField(vorlage)" />
    <div v-for="f in vorlage.fields" :key="f.id">
      <div class="row">
        <q-select v-model="f.field" :options="options" option-label="name" class="col-2" />
        <q-input v-model.number="f.row" type="number" label="Zeile" class="col-1" />
        <q-input v-model.number="f.column" type="number" label="Spalte" class="col-1" />
        <q-input v-model.number="f.column" type="number" label="Abstand (Spalte)" class="col-1"
          v-if="f.field.type == 'multicols' || f.field.type == 'multicols+multirows'" />
        <q-input v-model.number="f.column" type="number" label="Abstand (Zeile)" class="col-1"
          v-if="f.field.type == 'multicols+multirows'" />
        <q-btn label="Entfernen" @click="removeField(vorlage, f)" class="col-1" />
      </div>
    </div>
    <q-file label="Excel-Vorlage" v-model="vorlage.vorlage" />
  </div>

  <q-btn label="TEST" @click="test" />
  <q-btn label="Erstellen" @click="create" />
  <q-btn label="C" @click="createItem" />
  <q-btn label="R" @click="readItems" />
  <q-btn label="u" @click="updateItem" />
  <q-btn label="d" @click="deleteItem" />
</template>

<script lang="ts">
import { api } from 'src/boot/axios'
import { defineComponent, ref } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';
import { emittentDetailsFactory, messungFactory, auswertungFactory, ascendingFrequences, Messung, MesspunktAnAnlage, Emittent, EmittentDetails, Building, messpositionEditViewModelFactory, vorlageFactory, VorlageExcelbericht, PositionFeldExcelBericht, excelTemplateFactory } from 'src/models/v1';

import { useKatasterStore } from 'src/stores/kataster-store';




import { uuidv4 } from 'src/models/v1'
import { mapper } from 'src/mappings/mapper';
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useKatasterStore()

    const vorlage = ref(null as VorlageExcelbericht | null)

    const vorlagen = ref([] as VorlageExcelbericht[])

    const itemId = ''
    async function createItem() {
      // const result = (await store.getDb.rel.find('template', itemId)).articles[0]

      const v = excelTemplateFactory.build()

      const v_mapped = mapper.map(v, 'VorlageExcelbericht', 'PouchVorlageExcelbericht')



      console.log(v, v_mapped)

      await store.getMasterDb.rel.save('template', v_mapped)


      vorlagen.value.push(v)
    }

    async function updateItem() {

      const v_mapped = mapper.map(vorlage.value, 'VorlageExcelbericht', 'PouchVorlageExcelbericht')

      console.log(v_mapped)

      const bisher = (await store.getMasterDb.rel.find('template', vorlage.value?.id)).templates[0]
      console.log(bisher)
      if (vorlage.value?.vorlage) {





      } else {

        await store.getMasterDb.rel.removeAttachment('template', bisher, 'template')
      }






    }

    async function readItems() {
      const bisher = (await store.getMasterDb.rel.find('template')).templates

      console.log(bisher)

      const v_mapped = bisher.map((i: any) => mapper.map(i, 'PouchVorlageExcelbericht', 'VorlageExcelbericht'))

      console.log(v_mapped)
    }

    async function deleteItem() {
      const bisher = (await store.getMasterDb.rel.find('template', itemId)).templates[0]
    }

    const options = [
      { type: 'single', name: 'Name' },
      { type: 'single', name: 'GK-Rechts' },
      { type: 'single', name: 'GK-Hoch' },
      { type: 'single', name: 'Breite' },
      { type: 'single', name: 'Länge' },
      { type: 'single', name: 'Dach' },
      { type: 'single', name: 'Gebäude' },
      { type: 'multicols', name: 'LwLin' },
      { type: 'multicols+multirows', name: 'Gesamtpegel' },
      { type: 'multicols+multirows', name: 'Fremdpegel' },
      { type: 'multicols+multirows', name: 'Anlagenpegel' },

    ]




    const fields = ref([{ id: uuidv4(), row: 1, column: 1, field: options[0] }])

    const emittent = emittentDetailsFactory.build()

    async function create() {
      store.createExcelTemplateBackend(vorlageFactory.build())
    }

    function addField(target: VorlageExcelbericht) {
      target.fields.push({ id: uuidv4(), row: 1, column: 1, field: options[0] })
    }

    function removeField(target: VorlageExcelbericht, arg: PositionFeldExcelBericht) {
      const idx = target.fields.findIndex((i: any) => i.id == arg.id)
      target.fields.splice(idx, 1)



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

    const file = ref(null as File | null)


    return {
      file,
      test,
      create,
      fields, options, addField, removeField,
      createItem, readItems, updateItem, deleteItem,
      vorlage,
      vorlagen
    }
  }

})
</script>
