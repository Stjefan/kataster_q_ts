<template>
  <q-input label="Bezeichnung" :model-value="name" @update:model-value="$emit('update:name', $event)" />
  <q-input label="Suche ab Zeile beginnen" :model-value="offsetLines"
    @update:model-value="$emit('update:offsetLines', $event)" />
  <div v-for="f in fieldsInMessfile" :key="f.id">
    <q-input :label="f.maps_to" v-model="f.col" type="number" />
  </div>

  <q-btn label="Messgerät löschen" @click="$emit('remove')" />
  <q-btn label="Änderungen speichern" @click="$emit('save')" />
  <q-btn label="test" @click="test" />
  <q-select label="Messfile" v-model="file2find" :options="store.overviews" option-label="upload" />
  <q-input label="Messfile" v-model="nameTestmessfile" />
  {{ eingelesenePegelwerte }}
</template>

<script lang="js">
import { defineComponent, ref } from 'vue'
import { excelFieldImportFactory, pegelfrequenzenFields } from 'src/models/v1';
import { api } from 'src/boot/axios';
import ExcelJS from 'exceljs'
import { useKatasterStore } from 'src/stores/kataster-store';
export default defineComponent({
  props: ['name', 'offsetLines'],
  // name: 'ComponentName'
  setup(props) {
    const store = useKatasterStore()
    let file2find = ref('')
    const fieldsInMessfile = ref([
    ].concat(pegelfrequenzenFields.map((i, ix) => excelFieldImportFactory.build({ maps_to: i, col: 13 + ix, name: i }))))

    const eingelesenePegelwerte = null
    const nameTestmessfile = ref('0010')


    function test() {
      if (file2find.value) {
        console.log(file2find.value)
        api.get(file2find.value.upload,
          //'http://localhost:8080/overview118_200617.xlsx',
          {
            responseType: 'blob'
          })
          .then(async response => {
            console.log(response)
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(response.data);
            const worksheet = workbook.getWorksheet('Global');
            const result = {};
            const expectedCols = pegelfrequenzenFields.map((i, j) => ({
              column: 14 + j,
              name: i

            }))
            worksheet.eachRow((row, rowNumber) => {
              if (props.offsetLines >= rowNumber) {

              }
              else {
                if (
                  row.getCell(1).value != null &&
                  row.getCell(1).value.includes(file2find.value)
                ) {
                  console.log('Found in row ' + rowNumber);

                  for (let i of expectedCols) {
                    console.log(i.name, row.getCell(i.column).value);
                    result[i.name] = row.getCell(i.column).value;
                  }

                }
              }
              // console.log(row.getCell(1).value)


            })
            console.log(result)
          })

      }


    }



    return {
      file2find,
      fieldsInMessfile,
      test,
      nameTestmessfile,
      store
    }
  }
})
</script>
