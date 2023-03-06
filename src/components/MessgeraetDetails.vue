<template>
  <q-input label="Bezeichnung" :model-value="name" @update:model-value="$emit('update:name', $event)" />
  <q-input label="Suche ab Zeile beginnen" :model-value="offsetLines"
    @update:model-value="$emit('update:offsetLines', $event)" />
  <q-input label="hz31_5" :model-value="hz31_5" @update:model-value="$emit(`update:hz31_5`, parseInt($event))"
    type="number" class="col-2" />
  <q-input label="hz63" :model-value="hz63" @update:model-value="$emit(`update:hz63`, parseInt($event))" type="number"
    class="col-2" />
  <q-input label="hz125" :model-value="hz125" @update:model-value="$emit(`update:hz125`, parseInt($event))" type="number"
    class="col-2" />
  <q-input label="hz250" :model-value="hz250" @update:model-value="$emit(`update:hz250`, parseInt($event))" type="number"
    class="col-2" />
  <q-input label="hz500" :model-value="hz500" @update:model-value="$emit(`update:hz500`, parseInt($event))" type="number"
    class="col-2" />
  <q-input label="hz1000" :model-value="hz1000" @update:model-value="$emit(`update:hz1000`, parseInt($event))"
    type="number" class="col-2" />
  <q-input label="hz2000" :model-value="hz2000" @update:model-value="$emit(`update:hz2000`, parseInt($event))"
    type="number" class="col-2" />
  <q-input label="hz4000" :model-value="hz4000" @update:model-value="$emit(`update:hz4000`, parseInt($event))"
    type="number" class="col-2" />
  <q-input label="hz8000" :model-value="hz8000" @update:model-value="$emit(`update:hz8000`, parseInt($event))"
    type="number" class="col-2" />
  <br />
  <q-separator />
  <q-btn label="Messgerät löschen" @click="$emit('remove')" />
  <q-btn label="Änderungen speichern" @click="$emit('save')" />

  <div class="row">
    <q-select label="Messfile" v-model="file2find" :options="store.overviews" option-label="upload" class="col-5" />
    <q-input label="Messfile" v-model="nameTestmessfile" class="col-2" />
    <q-btn label="test" @click="test" class="col-2" />
  </div>
  <div class="row">
    {{ eingelesenePegelwerte }}
  </div>
  {{ embeddedExcel }}
</template>

<script lang="js">
import { defineComponent, ref, computed } from 'vue'
import { excelFieldImportFactory, pegelfrequenzenFields } from 'src/models/v1';
import { api } from 'src/boot/axios';
import ExcelJS from 'exceljs'
import { readMessfileInOverview } from 'src/utility/excelhandling'
import { useKatasterStore } from 'src/stores/kataster-store';
export default defineComponent({
  props: ['name', 'offsetLines', 'hz31_5', 'hz63', 'hz125', 'hz250', 'hz500', 'hz1000', 'hz2000', 'hz4000', 'hz8000'],
  // name: 'ComponentName'
  setup(props) {
    const store = useKatasterStore()
    let file2find = ref('')

    const fieldsInMessfile = computed(() => [
    ].concat(['hz31_5', 'hz63', 'hz125', 'hz250', 'hz500', 'hz1000', 'hz2000', 'hz4000', 'hz8000']).map((i, ix) => excelFieldImportFactory.build({ maps_to: i, col: props[i], name: i })))


    // const myFields = ['hz31_5', 'hz63', 'hz125', 'hz250', 'hz500', 'hz1000', 'hz2000', 'hz4000', 'hz8000']

    const eingelesenePegelwerte = ref(null)
    const nameTestmessfile = ref('0010')

    async function test() {
      if (file2find.value) {
        console.log(file2find.value)
        const myBlob = await store.getOverviewfile()
        const result = await readMessfileInOverview(myBlob, nameTestmessfile.value, fieldsInMessfile.value, props.offsetLines)
        // const workbook = new ExcelJS.Workbook();
        // await workbook.xlsx.load(myBlob);


        // const worksheet = workbook.getWorksheet('Global');
        // const result = {};
        // const expectedCols = fieldsInMessfile.value
        // worksheet.eachRow((row, rowNumber) => {
        //   console.log(row, rowNumber)
        //   if (props.offsetLines >= rowNumber) {

        //   }
        //   else {
        //     if (
        //       row.getCell(1).value != null &&
        //       row.getCell(1).value.includes(nameTestmessfile.value)
        //     ) {
        //       console.log('Found in row ' + rowNumber);

        //       for (let i of expectedCols) {
        //         console.log(row, i)
        //         console.log(i.name, row.getCell(i.col).value);
        //         result[i.name] = row.getCell(i.col).value;
        //       }

        //     }
        //   }
        //   // console.log(row.getCell(1).value)


        // })
        console.log(result)
        eingelesenePegelwerte.value = result




      }

    }

    return {
      file2find,
      fieldsInMessfile,
      test,
      nameTestmessfile,
      store,
      // myFields,
      eingelesenePegelwerte
    }
  }
})
</script>
