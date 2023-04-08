<template>
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
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { defineComponent, ref } from 'vue'
import { castNumber } from 'src/utility/errorHandling'

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

    return {
      handleSubmit, readDocs, createDoc, updateDoc, deleteDoc, editSelected,
      options,
      option,
      item,
      mode,
      values, items, addItem, removeItem, form, optionsVorlage, castNumber, fileInput
    }
  }
})
</script>
