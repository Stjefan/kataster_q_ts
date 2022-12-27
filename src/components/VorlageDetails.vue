<template>
  <q-input label="Bezeichnung" :model-value="name" @update:model-value="$emit('update:name', $event)" />
  <div>Angaben zum Emittent</div>
  <div>Angaben zur Messung</div>
  <div>Angaben zur Auswertung</div>
  <q-btn label="Vorlage löschen" @click="$emit('remove')" />
  <q-btn label="Änderungen speichern" @click="$emit('save')" />
  <q-btn label="TEST" @click="test" />
</template>

<script lang="js">
import { api } from 'src/boot/axios'
import { defineComponent } from 'vue'
import ExcelJS from 'exceljs'
export default defineComponent({
  // name: 'ComponentName'
  props: ['name'],
  setup() {


    function test() {

      api.get('http://localhost:8080/overview118_200617.xlsx', {
        responseType: 'blob'
      })
        .then(async response => {
          console.log(response)
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(response.data);
          const worksheet = workbook.getWorksheet('Global');
          const result = {};
          worksheet.eachRow((row, rowNumber) => {
            console.log(rowNumber)


            // console.log(row.getCell(1).value)


          })
        })
    }
    return {
      test
    }
  }

})
</script>
