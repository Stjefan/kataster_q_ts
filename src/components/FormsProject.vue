<template>
  <button @click="createDoc">Neues Projekt anlegen</button>

  <button @click="readDocs">Read</button>
  <q-select v-model="option" :options="options" option-label="name" />
  <FormKit type="button" @click="editSelected" label="Daten laden" />
  <FormKit type="button" @click="editSelected" label="Allgemeine Angaben bearbeiten" />
  <FormKit type="form" name="x" @submit="submitItem" v-model="item">
    <FormKit type="text" label="ID" name="id" :disabled="true" />
    <FormKit type="text" label="Name" name="name" validation="required" />
    <FormKit type="text" label="Datenbankbezeichnung" name="dbName" disabled />
    <button @click.prevent="deleteDoc">Delete</button>

  </FormKit>
  <div class="row">
    <button @input.prevent="deleteItem">Löschen</button>
    <button>Sync mit Remote-Datenbank</button>
  </div>
  {{ item }}
</template>

<script lang="ts">
import { uuidv4 } from 'src/models/v1'
import { defineComponent, ref } from 'vue'
import { useKatasterStore } from 'src/stores/kataster-store'
import { mapper } from 'src/mappings/mapper'
import { PouchProject } from 'src/models/pouch-api'
import { ProjectForm } from 'src/models/forms'
import { form } from '@formkit/inputs'

export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const mode = ref('create')
    const store = useKatasterStore()
    const options = ref([{ name: 'A', dbName: 'db_a', id: uuidv4() }, { name: 'b', dbName: 'db_b', id: uuidv4() }])
    const option = ref(null)
    const item = ref({} as ProjectForm)

    async function readDocs() {
      const docs = await store.getMasterDb.rel.find('project')
      const pArr = docs.projects

      const mappedArr = pArr.map((i: PouchProject) => mapper.map(i, 'PouchProject', 'ProjectForm'))
      console.log(pArr, mappedArr)
      options.value = mappedArr
    }

    async function submitItem(args: any) {
      console.log(args)
      let saveResult
      if (args.id) {
        console.log('Bereits vorhanden')
        const bisherDocs = await store.getMasterDb.rel.find('project', args.id)
        const mapped = mapper.map<ProjectForm, PouchProject>(args, 'ProjectForm', 'PouchProject')
        const bisher = bisherDocs.messgeraete[0]
        saveResult = await store.getMasterDb.rel.save('project', { ...bisher, ...mapped })
      } else {
        const mapped = mapper.map<ProjectForm, PouchProject>(args, 'ProjectForm', 'PouchProject')
        mapped.id = uuidv4()
        mapped.dbName = slugify(`${mapped.name}_${mapped.id}`)
        saveResult = await store.getMasterDb.rel.save('project', { ...mapped, })
      }
      console.log(saveResult)

      readDocs()




    }







    function slugify(title: string) {
      return title
        .trim()
        .replace(/ +/g, '-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
    }



    async function editSelected() {
      if (option.value != null) {
        const docs = await store.getMasterDb.rel.find('project')
        const mapped = mapper.map<ProjectForm, ProjectForm>(option.value, 'ProjectForm', 'ProjectForm')
        item.value = mapped

      }


    }

    async function createDoc() {
      item.value = {} as any

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
      readDocs, createDoc, deleteDoc, editSelected,
      options,
      option,
      item,
      deleteItem(eventArgs: unknown) {
        console.log('deleteItem')
      },
      submitItem

    }
  }
})
</script>
