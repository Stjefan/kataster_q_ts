<template>
  <div>Berichte</div>
  <FormKit type="button" label="Read" @click="readVorlagen" />
  <q-select v-model="report" :options="reports" />
  <q-select v-model="template" :options="templates" option-label="name" />
  <FormKit type="button" label="Create" @click="createReport" />
  <FormKit type="button" label="Löschen" />
  <FormKit type="button" label="Anzeigen" @click="downloadReport" />
</template>

<script lang="ts">
import saveAs from 'file-saver'
import { mapper } from 'src/mappings/mapper'
import { useKatasterStore } from 'src/stores/kataster-store'
import { createExcelReport } from 'src/utility/excelhandling'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useKatasterStore()
    const reports = ref([] as any[])
    const report = ref(null as any)

    const template = ref(null as any)
    const templates = ref([] as any)

    async function createReport() {
      if (template.value != null) {
        const vorlageAsBlob = await store.getMasterDb.rel.getAttachment('template', template.value.id, 'template')



        reports.value.push(await createExcelReport(vorlageAsBlob))
      }
    }

    function downloadReport() {
      saveAs(report.value, 'Test_2004.xlsx');

    }

    async function readVorlagen() {
      const docs = await store.getMasterDb.rel.find('template')
      const pArr = docs.templates
      const mappedArr = pArr.map((i: any) => mapper.map(i, 'PouchVorlageExcelbericht', 'FormVorlageExcelbericht'))
      console.log(pArr, mappedArr)
      templates.value = mappedArr

    }

    return {
      reports,
      report,
      template,
      templates,
      downloadReport,
      createReport,
      readVorlagen
    }
  }
})
</script>
