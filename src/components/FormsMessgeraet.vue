<template>
  <div>Details zu Messgerät</div>
  {{ mode }}
  <FormKit type="button" @click="readDocs" label="Read" />
  <q-select v-model="option" :options="options" option-label="name" />
  <FormKit type="button" @click="createEmpty" label="Neu" />
  <FormKit type="button" @click="editSelected" label="Bearbeiten" />
  <FormKit type="form" @submit="handleSubmit" id="form-emittent" v-model="item" option-label="name">
    <FormKit type="text" label="Bezeichnung" name="name" validation="required" />
    <FormKit type="text" label="Seriennummer" name="seriennummer" />
    <FormKit type="number" label="Überspringe Zeilen" name="skippedLines" />
    <FormKit type="number" name="hz31_5" label="Spaltennummer 31.5 Hz" />
    <FormKit type="number" name="hz63" label="Spaltennummer 63 Hz" />
    <FormKit type="number" name="hz125" label="Spaltennummer 125 Hz" />
    <FormKit type="number" name="hz250" label="Spaltennummer 250 Hz" />
    <FormKit type="number" name="hz500" label="Spaltennummer 500 Hz" />
    <FormKit type="number" name="hz1000" label="Spaltennummer 1000 Hz" />
    <FormKit type="number" name="hz2000" label="Spaltennummer 2000 Hz" />
    <FormKit type="number" name="hz4000" label="Spaltennummer 4000 Hz" />
    <FormKit type="number" name="hz8000" label="Spaltennummer 8000 Hz" />
  </FormKit>
</template>

<script lang="ts">
import { mapper } from 'src/mappings/mapper'
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    async function handleSubmit(args: any) {
      console.log(args)
      const mapped = mapper.map(item.value, 'MessgeraetForm', 'PouchMessgeraet',)
      let saveResult
      if (args.id) {
        console.log('Bereits vorhanden')
        const bisherDocs = await store.getDb.rel.find('messgeraet', args.id)
        const bisher = bisherDocs.messgeraete[0]
        saveResult = await store.getDb.rel.save('messgeraet', { ...bisher, ...mapped })
      } else {
        saveResult = await store.getDb.rel.save('messgeraet', { ...mapped })
      }

      readDocs()


    }

    const mode = ref('create')
    const store = useKatasterStore()
    const options = ref([{ name: 'A', dbName: 'db_a', id: uuidv4() }, { name: 'b', dbName: 'db_b', id: uuidv4() }])
    const option = ref(null)
    const item = ref({} as any)

    async function readDocs() {
      const docs = await store.getDb.rel.find('messgeraete')
      const pArr = docs.messgeraete

      console.log(pArr)

      const mappedArr = pArr.map((i: any) => mapper.map(i, 'PouchMessgeraet', 'MessgeraetForm'))
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

        const mapped = mapper.map<any, any>(option.value, 'MessgeraetForm', 'MessgeraetForm')
        item.value = mapped
        console.log('Mapped', mapped)

      }


    }

    function createEmpty() {
      item.value = {}

    }

    async function createDoc() {
      console.log('create', item.value)

      const mapped = mapper.map<any, any>(item.value, 'MessgeraetForm', 'PouchMessgeraet')

      await store.getDb.rel.save('PouchMessgeraet', { ...mapped, id: uuidv4() })

      readDocs()

    }

    async function deleteDoc() {
      if (item.value != null) {
        const docs = await store.getMasterDb.rel.find('project', item.value.id)
        const fromDb = docs.projects[0]

        await store.getMasterDb.rel.del('project', fromDb)

        readDocs()
      }

    }

    return {
      handleSubmit, readDocs, createDoc, updateDoc, deleteDoc, editSelected,
      options,
      option,
      item,
      mode,
      createEmpty,
    }
  }
})
</script>
