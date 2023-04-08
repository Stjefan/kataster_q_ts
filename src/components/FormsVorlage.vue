<template>
  <q-btn label="Test" @click="erstelleXlsxReport" />
  <q-btn label="Read" @click="readDocs" />
  <q-btn label="Create" @click="createDoc" />
  <q-select v-model="option" :options="options" option-label="name" />
  <q-btn label="Bearbeiten" @click="editSelected" />
  <FormKit type="form" name="form-1" @submit="handleSubmit" v-model="item">
    <FormKit label="Name" name="name" type="text" />
    <FormKit label="ID" name="id" type="text" :disabled="true" />

    <FormKit type="list" v-model="values" name="fields" label="Felder">
      <FormKit v-for="key in items" :key="key" :id="key" type="group" label="Group" validation="required">
        <div class="row">
          <FormKit name="id" :disabled="true" type="text" :model-value="key" label="ID" />
          <FormKit label="Feld" name="field" type="select" :options="optionsVorlage" />

          <FormKit label="Spalte" name="column" type="number" validation="required" :plugins="[castNumber]" />
          <FormKit label="Zeile" name="row" type="number" validation="required" :plugins="[castNumber]" />
          <FormKit type="button" :data-key="key" href="#" @click="removeItem" label="-" />

        </div>
      </FormKit>

    </FormKit>
    <br />
    <FormKit type="button" @click.prevent="addItem" label="+" />
    <div class="row">
      <FormKit label="xlsx-Vorlage" name="vorlage" type="file" />
    </div>
  </FormKit>
</template>

<script lang="ts">
import { getNode } from '@formkit/core'
import { mapper } from 'src/mappings/mapper'
import { anlagenpegelFactory, Anlagenpegelreihe, ascendingFrequences, auswertungFactory, Building, buildingFactory, EmittentDetails, emittentDetailsFactory, messpositionEditViewModelFactory, MesspunktAnAnlage, Messung, messungFactory, plantFactory, Roof, roofFactory, uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { defineComponent, ref } from 'vue'
import { castNumber } from 'src/utility/errorHandling'
import { api } from 'src/boot/axios'
import ExcelJS from 'exceljs'
import * as _ from 'lodash'
import saveAs from 'file-saver'

export default defineComponent({
  // name: 'ComponentName'
  setup() {
    async function handleSubmit(args: any) {
      console.log(args)

      if (args.vorlage.length) {
        const mapped = mapper.map(args, 'FormVorlageExcelbericht', 'PouchVorlageExcelbericht')
        console.log(mapped)
        const file = args.vorlage[0]
        if (true) {
          let saveResult
          if (args.id) {
            console.log('Bereits vorhanden')
            const bisherDocs = await store.getMasterDb.rel.find('template', args.id)
            const bisher = bisherDocs.templates[0]
            saveResult = await store.getMasterDb.rel.save('template', { ...bisher, ...mapped, filename: file.name })
          } else {
            saveResult = await store.getMasterDb.rel.save('template', { ...mapped, filename: args.filename, id: uuidv4() })
          }


          console.log(saveResult)

          const currentlyCreated = await store.getMasterDb.rel.find('template', saveResult.id)

          const current = currentlyCreated.templates[0]

          console.log(currentlyCreated)

          if (file.file != null) {
            await store.getMasterDb.rel.putAttachment('template', current, 'template', file.file, file.file.type)
          }

          readDocs()
        }
      }

    }

    const optionsVorlage = [
      { label: 'Name', value: { type: 'single', name: 'Name' } },
      { label: 'GK-Rechts', value: { type: 'single', name: 'GK-Rechts' } },
      { label: 'GK-Hoch', value: { type: 'single', name: 'GK-Hoch' } },
      { label: 'Breite', value: { type: 'single', name: 'Breite' } },
      { label: 'Länge', value: { type: 'single', name: 'Länge' } },
      { label: 'Dach', value: { type: 'single', name: 'Dach' } },
      { label: 'Gebäude', value: { type: 'single', name: 'Gebäude' } },

      { label: 'LwLin', value: { type: 'multicol-singlerow', name: 'LwLin' } },
      { label: 'LwA', value: { type: 'multicol-singlerow', name: 'LwA' } },

    ]

    const mode = ref('create')
    const store = useKatasterStore()
    const options = ref([{ name: 'A', dbName: 'db_a', id: uuidv4() }, { name: 'b', dbName: 'db_b', id: uuidv4() }])
    const option = ref(null as any)
    const form = ref(null as any)

    const fileInput = ref([] as any)
    const values = ref([] as any[])
    const items = ref([] as string[])
    const item = ref({} as any)

    async function readDocs() {
      const docs = await store.getMasterDb.rel.find('template')
      const pArr = docs.templates

      console.log(pArr)

      const mappedArr = pArr.map((i: any) => mapper.map(i, 'PouchVorlageExcelbericht', 'FormVorlageExcelbericht'))
      console.log(pArr, mappedArr)
      options.value = mappedArr
    }

    async function updateDoc() {
      if (item.value != null) {
        const docs = await store.getDb.rel.find('PouchMessgeraet', item.value.id)
        const fromDb = docs.projects[0]
        const mapped = mapper.map(item.value, 'MessgeraetForm', 'PouchMessgeraet',)
        console.log(mapped)

        await store.getMasterDb.rel.save('PouchMessgeraet', { ...fromDb, ...mapped })

        readDocs()



      }


    }

    async function editSelected() {
      if (option.value != null) {
        items.value = []
        const mapped = mapper.map<any, any>(option.value, 'FormVorlageExcelbericht', 'FormVorlageExcelbericht')

        console.log('Mapped', mapped, mapped.fields.length)


        items.value = mapped.fields.map((i: any) => i.id)
        const node1 = getNode('form-1');
        await node1?.isSettled;

        console.log('Push now');
        values.value = mapped.fields


        if (mapped.filename != null) {
          mapped.vorlage = [{ name: mapped.filename }]

        } else {
          mapped.vorlage = []
        }

        console.log(mapped.filename)

        item.value = mapped

      }


    }

    async function createDoc() {
      items.value = []
      const node1 = getNode('form-1');
      await node1?.isSettled;
      values.value = []
      item.value = {}

    }

    async function deleteDoc() {
      if (item.value != null) {
        const docs = await store.getMasterDb.rel.find('project', item.value.id)
        const fromDb = docs.projects[0]

        await store.getMasterDb.rel.del('project', fromDb)

        readDocs()
      }

    }

    const addItem = () => {
      items.value.push(uuidv4());
    }

    const removeItem = (e: any) => {
      e.preventDefault();
      const key = e.target.getAttribute('data-key');
      console.log(items.value, key);
      console.log([...items.value]);
      items.value = items.value.filter((item) => item !== key);
      console.log([...items.value]);
    };

    async function erstelleXlsxReport() {
      const vorlage = {
        fields: [{
          field: 'name',
          column: 3,
          row: 5
        },
        {
          field: 'dach',
          column: 3,
          row: 4
        },
        {
          field: 'gebaeude',
          column: 13,
          row: 4
        }, {
          field: 'gkrechts',
          column: 5,
          row: 8
        },
        {
          field: 'messverfahren',
          column: 9,
          row: 6,
        },
        {
          field: 'messdatum',
          column: 5,
          row: 12,
        },
        {
          field: 'gkhoch',
          column: 3,
          row: 8
        },
        {
          field: 'hoehe',
          column: 7,
          row: 8
        },
        {
          field: 'geo1',
          column: 3,
          row: 10
        },
        {
          field: 'geo2',
          column: 5,
          row: 10
        },
        {
          field: 'geo3',
          column: 7,
          row: 10
        },
        {
          field: 'geoxy',
          column: 3,
          row: 14
        },
        {
          field: 'geoh',
          column: 5,
          row: 14
        },
        {
          field: 'komega',
          column: 7,
          row: 14
        },
        {
          field: 'messverfahren',
          column: 9,
          row: 5
        },
        {
          field: 'lwlin',
          column: 3,
          row: 37
        },
        {
          field: 'lwa',
          column: 3,
          row: 38
        },
        {
          field: 'anlagenpegel',
          column: 3,
          row: 17,
          space: 2
        },
        {
          field: 'fremdpegel',
          column: 3,
          row: 18,
          space: 2
        },
        {
          field: 'gesamtpegel',
          column: 3,
          row: 18,
          space: 2
        },
        ]

      }






      console.log('Vorlage')
      console.log('createExcel');
      const messung = await messungFactory.build({ type: '4P' })
      const emittent = emittentDetailsFactory.build()
      const plant = plantFactory.build()
      const building = buildingFactory.build({ parent: plant.id })
      const roof = roofFactory.build({ parent: building.id })

      messung!.auswertung = auswertungFactory.build()
      messung!.auswertung.anlagenpegel.push(anlagenpegelFactory.build())
      messung!.auswertung.anlagenpegel.push(anlagenpegelFactory.build())
      api.get('http://localhost:8080/13135EZW-SQKataster_EXCEL-Master.xlsx', { responseType: 'arraybuffer', })
        .then(async (doc: any) => {
          console.log(doc);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(doc.data);
          const sheet = workbook.getWorksheet('Vorlage'); // workbook.addWorksheet('My Sheet');

          const getters = [
            { getter: (i: Messung) => i.geometrie_emittent.geo1, name: 'geo1' },
            { getter: (i: Messung) => i.geometrie_emittent.geo2, name: 'geo2' },
            { getter: (i: Messung) => i.geometrie_emittent.geo3, name: 'geo3' },
            { getter: (i: Messung) => i.geometrie_emittent.geo4, name: 'geo4' },
            { getter: (i: Messung) => i.geometrie_messung.geoxy, name: 'geoxy' },
            { getter: (i: Messung) => i.geometrie_messung.geoh, name: 'geoh' },
            { getter: (i: Messung) => i.datum, name: 'messdatum' },
            { getter: (i: Messung) => i.geometrie_messung.k2a, name: 'k2a' },
            { getter: (i: Messung) => i.geometrie_messung.komega, name: 'koemga' },
            { getter: (i: Messung) => i.messverfahren, name: 'messverfahren' },

            /*
            (i: Messung) => i.auswertung?.lwlin,
            (i: Messung) => i.auswertung?.lwa,
            (i: Messung) => i.auswertung?.anlagenpegel[0].korrektur
            */


          ]


          const gettersBuilding = [
            { getter: (i: Building) => i.name, name: 'gebaeude' },
          ]

          const gettersRoof = [
            { getter: (i: Roof) => i.name, name: 'dach' }
          ]

          const gettersEmittent = [
            { getter: (i: EmittentDetails) => i.name, name: 'name' },
            { getter: (i: EmittentDetails) => i.gkrechts, name: 'gkrechts' },
            { getter: (i: EmittentDetails) => i.gkhoch, name: 'gkhoch' },
            { getter: (i: EmittentDetails) => i.hoehe, name: 'hoehe' }
          ]

          const rowGetters = [
            { getter: (i: Messung) => i.auswertung?.lwlin, name: 'lwlin' },
            { getter: (i: Messung) => i.auswertung?.lwa, name: 'lwa' },
          ]
          const multirowGetters = [
            // { getter: (i: Messung) => i.messpositionen, name: 'messpositionen' },
            { getter: (i: Messung) => i.auswertung?.anlagenpegel, name: 'anlagenpegel' },
            { getter: (i: Messung) => i.auswertung?.mittelungspegel_fremd, name: 'fremdpegel' },
            { getter: (i: Messung) => i.auswertung?.mittelungspegel_gesamt, name: 'gesamtpegel' }
          ]

          const merged_messung = Object.values(_.merge(_.keyBy(getters, 'name'), _.keyBy(vorlage.fields, 'field'))).filter(i => i.row != null && i.getter != null)




          console.log('merged_messung', merged_messung)

          const merged_emittent = Object.values(_.merge(_.keyBy(gettersEmittent, 'name'), _.keyBy(vorlage.fields, 'field'))).filter(i => i.row != null && i.getter != null)

          console.log('merged_emittent', merged_emittent)


          const merged_roof = Object.values(_.merge(_.keyBy(gettersRoof, 'name'), _.keyBy(vorlage.fields, 'field'))).filter(i => i.row != null && i.getter != null)

          console.log('merged_roof', merged_roof)


          const merged_building = Object.values(_.merge(_.keyBy(gettersBuilding, 'name'), _.keyBy(vorlage.fields, 'field'))).filter(i => i.row != null && i.getter != null)

          console.log('merged_building', merged_building)


          const merged_rowgetters = Object.values(_.merge(_.keyBy(rowGetters, 'name'), _.keyBy(vorlage.fields, 'field'))).filter(i => i.row != null && i.getter != null)

          console.log('merged_rowgetters', merged_rowgetters)


          const merged_multirowgetters = Object.values(_.merge(_.keyBy(multirowGetters, 'name'), _.keyBy(vorlage.fields, 'field'))).filter(i => i.row != null && i.getter != null)

          console.log('merged_multirowgetters', merged_multirowgetters)


          if (messung != null) {

            for (const g of merged_messung) {
              console.log(g)
              const resultGetter = g.getter(messung)
              sheet.getCell(g.row, g.column).value = resultGetter
            }


            for (const g of merged_rowgetters) {
              console.log(g)
              const resultGetter = g.getter(messung)
              let propCounter = 0
              for (const f of ascendingFrequences(resultGetter!)) {
                console.log(f)

                sheet.getCell(g.row, g.column + propCounter).value = f
                propCounter++
              }
            }

            for (const g of merged_multirowgetters) {
              const resultGetter = g.getter(messung)
              console.log('Rows', resultGetter)
              if (resultGetter != null) {
                let rowCounter = 0
                for (const r of resultGetter) {
                  let propCounter = 0
                  for (const f of ascendingFrequences(r!)) {
                    console.log('Inserting ', f, ' in ', g.row + rowCounter, g.column + propCounter)

                    sheet.getCell(g.row + rowCounter, g.column + propCounter).value = f
                    propCounter++
                  }
                  if (g.name == 'anlagenpegel') {
                    sheet.getCell(g.row + rowCounter, g.column + propCounter).value = (r as unknown as Anlagenpegelreihe).korrektur
                    propCounter++
                  }
                  rowCounter += g.space! + 1
                  console.log('Rows', rowCounter)


                }
              }


            }




          }

          if (emittent != null) {

            for (const g of merged_emittent) {

              sheet.getCell(g.row, g.column).value = g.getter(emittent)

            }
          }

          if (roof != null) {

            for (const g of merged_roof) {

              sheet.getCell(g.row, g.column).value = g.getter(roof)

            }
          }

          if (building != null) {

            for (const g of merged_building) {

              sheet.getCell(g.row, g.column).value = g.getter(building)

            }
          }


          const buf = await workbook.xlsx.writeBuffer();

          store.$patch(state => state.reports.push(new Blob([buf])))

          console.log(store.reports)

          saveAs(new Blob([buf]), 'Test_2002.xlsx');
        });
    }

    return {
      handleSubmit, readDocs, createDoc, updateDoc, deleteDoc, editSelected,
      options,
      option,
      item,
      mode,
      values, items, addItem, removeItem, form, optionsVorlage, castNumber, fileInput, erstelleXlsxReport
    }
  }
})
</script>
