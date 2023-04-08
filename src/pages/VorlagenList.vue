<template>
  <q-page padding>
    <!-- content -->
    <forms-vorlage />

  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { anlagenpegelFactory, Anlagenpegelreihe, ascendingFrequences, auswertungFactory, Building, EmittentDetails, emittentDetailsFactory, MesspunktAnAnlage, Messung, messungFactory, Roof, Vorlage, vorlageFactory } from 'src/models/v1'
// import VorlageDetails from 'src/components/VorlageDetails.vue'
import { useKatasterStore } from '../stores/kataster-store'
import { token } from '@formkit/utils';

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';
import { api } from 'src/boot/axios';
import * as _ from 'lodash'

import FormsVorlage from 'src/components/FormsVorlage.vue';

export default defineComponent({
  components: { FormsVorlage },
  // name: 'PageName'
  setup() {
    function submitVorlage(event: any) {
      console.log(event)

    }
    const store = useKatasterStore()
    const fields = Array.from([...Array(36).keys()])
    const vorlagen = computed(() => store.vorlagen)
    const selectedVorlage = ref(null as Vorlage | null)



    const options = [
      { label: 'Name', value: { type: 'single', name: 'Name' } },
      { label: 'GK-Rechts', value: { type: 'single', name: 'GK-Rechts' } },
      { label: 'GK-Hoch', value: { type: 'single', name: 'GK-Hoch' } },
      { label: 'Breite', value: { type: 'single', name: 'Breite' } },
      { label: 'Länge', value: { type: 'single', name: 'Länge' } },
      { label: 'Dach', value: { type: 'single', name: 'Dach' } },
      { label: 'Gebäude', value: { type: 'single', name: 'Gebäude' } },

    ]

    const s1 = {
      field: 'emittent.name',
      row: 'number',
      col: 'number',
      type: 'number',
    }
    const values = ref([] as any[])
    const items = ref([] as any[])

    function submitItem(args: any) {
      console.log('saving', args);
    }

    const addItem = () => {
      items.value.push(token());
    }

    const removeItem = (e: any) => {
      e.preventDefault();
      const key = e.target.getAttribute('data-key');
      console.log(items.value, key);
      console.log([...items.value]);
      items.value = items.value.filter((item) => item !== key);
      console.log([...items.value]);
    };

    async function runTestVorlage() {

      const vorlage = {
        fields: [{
          field: 'name',
          column: 1,
          row: 1
        }, {
          field: 'gkrechts',
          column: 2,
          row: 2
        },
        {
          field: 'gkrechts',
          column: 4,
          row: 5
        },
        {
          field: 'geo1',
          column: 5,
          row: 6
        },
        {
          field: 'messverfahren',
          column: 5,
          row: 8
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
            { getter: (i: Messung) => i.geometrie_messung.k2a, name: 'geok2a' },
            { getter: (i: Messung) => i.geometrie_messung.komega, name: 'koemga' },
            { getter: (i: Messung) => i.messverfahren, name: 'messverfahren' },
            // { getter: (i: Messung) => i.auswertung?.lwlin, name: 'lwlin' },
            // { getter: (i: Messung) => i.auswertung?.lwa, name: 'lwa' }
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


          const merged_roof = _.merge(_.keyBy(gettersRoof, 'name'), _.keyBy(vorlage.fields, 'field'));

          console.log('merged_roof', Object.values(merged_roof).filter(i => i.row != null && i.getter != null))


          const merged_building = _.merge(_.keyBy(gettersBuilding, 'name'), _.keyBy(vorlage.fields, 'field'));

          console.log('merged_roof', Object.values(merged_roof).filter(i => i.row != null && i.getter != null))


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


          const buf = await workbook.xlsx.writeBuffer();

          store.$patch(state => state.reports.push(new Blob([buf])))

          console.log(store.reports)

          saveAs(new Blob([buf]), 'Test_2001.xlsx');
        });
    }


    return {
      runTestVorlage,
      removeItem,
      addItem,
      create() {

        store.createExcelTemplateBackend(vorlageFactory.build())


      },
      saveChanges() {
        if (selectedVorlage.value != null) {
          store.updateExcelTemplateBackend(selectedVorlage.value)
        }
      },
      submitItem,
      selectedVorlage,
      vorlagen,
      fields,
      submitVorlage,
      s1,
      options,
      values,
      items
    }
  }
})
</script>
