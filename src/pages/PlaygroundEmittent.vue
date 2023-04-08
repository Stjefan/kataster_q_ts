<template>
  <q-select v-model="vorlage" :options="vorlagen" option-label="name" />
  <q-btn label="xlsx-Bericht erstellen" @click="createXlsxReport" />
  <q-select v-model="report" :options="reports" option-label="filename" />
  <q-btn label="Bericht ansehen" @click="showXlsxReport" />
  <forms-auswertung />
</template>

<script lang="ts">
import { getNode } from '@formkit/core'
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { computed, defineComponent, ref } from 'vue'
import { getRandomNumber } from 'src/utility/errorHandling'

import FormsAuswertung from 'src/components/FormsAuswertung.vue'
export default defineComponent({
  components: { FormsAuswertung },
  // name: 'PageName'
  setup() {
    const store = useKatasterStore()

    const messgeraete = computed(() => store.messgeraete.map(i => ({ label: i.name, value: i.id })))
    const messgeraet = ref(null as any)

    const overviews = computed(() => store.overviews.map(i => ({ label: i.filename, value: i.id })))
    const overview = ref(null as any)

    const vorlagen = computed(() => store.vorlagen)
    const vorlage = ref(null as any)

    const reports = ref([] as any[])
    const report = ref(null as any)

    function createXlsxReport() {
      const r = { id: uuidv4() } as any
      r.filename = `report_${r.id}.xlsx`
      r.created = Date.now()
      reports.value.push(r)
    }

    function showXlsxReport() {
      console.log(report.value)
    }



    const cols = [{ label: 'ID', field: 'id', name: 'col1' }, { label: 'Nowhere', name: 'col2', field: 'name' }, { label: 'Nowhere', name: 'col3', }]

    function submitHandler(args: any) {
      console.log(args)

    }

    async function addItem() {
      const val = { id: uuidv4(), fremdpegelVorhanden: false }
      rows.value.push(val)

      // const node1 = getNode('form-messungen');
      //console.log('node1', node1)
      //console.log(getNode('blabla'))
      //await node1?.isSettled;

      //items.value.push(val.id)
    }

    function removeItem(e: any) {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(rows.value, key)

      const idx = values.value.findIndex(item => item.id == key)

      rows.value = rows.value.filter(item => item.id != key)
      console.log(rows.value)
    }


    const items = ref([])
    const rows = ref([{ id: uuidv4(), fremdpegelVorhanden: false }])
    const values = ref([{ id: uuidv4(), 'gesamtpegel.hz31_5': 32.3, 'gesamtpegel.hz63': 12.456 }, { id: uuidv4() }, { id: uuidv4() }])

    function readDocs() {
      values.value = []
      const arrOfFrequenzen = [
        'hz31_5',
        'hz63',
        'hz125',
        'hz250',
        'hz500',
        'hz1000',
        'hz2000',
        'hz4000',
        'hz8000',
      ];
      const funArr = [{ id: uuidv4() }, { id: uuidv4() }] as any[]
      for (let f of funArr) {
        for (let i of arrOfFrequenzen) {
          f[`gesamtpegel.${i}`] = getRandomNumber()
        }
      }
      // rows.value = [fun]
      rows.value = funArr.map(i => ({ id: i.id, fremdpegelVorhanden: false }))
      values.value = funArr
    }

    return {
      readDocs,
      values,
      submitHandler,
      rows,
      cols,
      addItem,
      removeItem,
      messgeraete,
      overviews,
      vorlagen,
      vorlage,
      reports,
      report,
      createXlsxReport,
      showXlsxReport
    }






  }
})
</script>
