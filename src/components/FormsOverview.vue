<template>
  <q-btn label="Read" @click="readDocs" />
  <div>Overview hochladen</div>
  <q-btn label="Create" @click="create" />
  <q-select v-model="option" :options="options" option-label="filename" />
  <q-btn label="Edit" @click="editSelected" />
  <FormKit type="form" @submit="handleSubmit" submit-label="Update" id="form-emittent" v-model="item">
    <FormKit type="text" label="ID" name="id" :disabled="true" />

    <FormKit type="text" label="Bezeichnung" name="filename" :disabled="true" />
    <FormKit type="date" label="zuletzt geändert" name="lastModfied" :disabled="true" />
    <FormKit type="file" label="Overview" name="overview" accept=".xlsx" validation="required" v-model="overviewFile"
      @update:modelValue="handleFileUpload" />


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
    const overviewFile = ref(null as any)
    function handleFileUpload(args: any) {
      console.log(args)
      if (args != null && args.length > 0) {
        item.value.filename = args[0].name

      }
    }
    async function handleSubmit(args: any) {
      console.log(args)

      if (args.overview.length) {
        const file = args.overview[0]
        let saveResult
        if (args.id) {
          console.log('Bereits vorhanden')
          const bisherDocs = await store.getDb.rel.find('overview', args.id)
          const bisher = bisherDocs.overviews[0]
          saveResult = await store.getDb.rel.save('overview', { ...bisher, filename: file.name })
        } else {
          saveResult = await store.getDb.rel.save('overview', { filename: args.filename, id: uuidv4() })
        }


        console.log(saveResult)

        const currentlyCreated = await store.getDb.rel.find('overview', saveResult.id)

        const current = currentlyCreated.overviews[0]

        console.log(currentlyCreated)

        if (file.file != null) {
          await store.getDb.rel.putAttachment('overview', current, 'overview', file.file, file.file.type)
        }

        readDocs()
      }

    }

    const mode = ref('create')
    const store = useKatasterStore()
    const options = ref([] as any[])
    const option = ref(null)
    const item = ref({} as any)

    async function readDocs() {
      const docs = await store.getDb.rel.find('overview')
      const pArr = docs.overviews

      console.log(pArr)

      const mappedArr = pArr.map((i: any) => mapper.map(i, 'PouchOverview', 'OverviewForm'))

      console.log(pArr, mappedArr)
      options.value = mappedArr
    }

    async function updateDoc() {
      if (item.value != null) {
        const docs = await store.getDb.rel.find('PouchOverview', item.value.id)
        const fromDb = docs.projects[0]
        const mapped = mapper.map(item.value, 'OverviewForm', 'PouchOverview',)
        console.log(mapped)

        await store.getMasterDb.rel.save('PouchOverview', { ...fromDb, ...mapped })

        readDocs()



      }


    }

    async function create() {
      item.value = {}
    }


    async function editSelected() {
      if (option.value != null) {

        const mapped = mapper.map<any, any>(option.value, 'OverviewForm', 'OverviewForm')
        item.value = mapped
        item.value.overview = [{ name: item.value.filename }]
        console.log('Mapped', mapped)

      }


    }

    async function createDoc() {
      console.log('create', item.value)

      const mapped = mapper.map<any, any>(item.value, 'OverviewForm', 'PouchMessgeraet')

      await store.getDb.rel.save('PouchMessgeraet', { ...mapped, id: uuidv4() })

      readDocs()

    }

    async function deleteDoc() {
      if (item.value != null) {
        const docs = await store.getDb.rel.find('PouchMessgeraet', item.value.id)
        const fromDb = docs.overviews[0]

        await store.getDb.rel.del('PouchMessgeraet', fromDb)

        readDocs()
      }

    }

    return {
      handleSubmit, readDocs, createDoc, updateDoc, deleteDoc, editSelected,
      options,
      option,
      item,
      mode,
      handleFileUpload,
      create,
      overviewFile
    }
  }
})
</script>
