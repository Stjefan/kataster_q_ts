<template>
  <q-select v-model="vorlage" :options="vorlagen" label="Vorlage" option-label="name" />
  <q-btn label="Editieren" @click="editSelected" />
  <q-btn label="Löschen" @click="deleteSelected" />
  <q-btn label="Neu" @click="createInDb" />
  <FormKit type="form" name="form-1" @submit="submitItem" :config="{ validationVisibility: 'submit' }" v-model="form"
    v-if="form">
    <FormKit label="Name" name="name" type="text" />
    <FormKit label="ID" name="id" type="text" :disabled="true" />

    <FormKit type="list" v-model="values" name="fields" label="Felder">
      <FormKit v-for="key in items" :key="key" :id="key" type="group" label="Group" validation="required">
        <div class="row">
          <FormKit name="id" :disabled="true" type="text" :model-value="key" />
          <FormKit label="Feld" name="field" type="select" :options="options" />

          <FormKit label="Spalte" name="column" type="number" validation="required" />
          <FormKit label="Zeile" name="row" type="number" validation="required" />

        </div>
        <button class="formkit-remove" :data-key="key" href="#" @click="removeItem">-</button>
      </FormKit>

    </FormKit>
    <br />
    <button type="button" @click.prevent="addItem">Feld hinzufügen</button>
    <div class="row">
      <FormKit label="xlsx-Vorlage" name="vorlage" type="file" :value="[{ name: 'purple-taste.pdf' }]" />
    </div>
  </FormKit>
  <div class="row">
    <!--<q-btn label="Load values" @click="loadValues" />-->
    <q-btn label="Read" @click="readInDb" />
    <q-btn label="Update" @click="updateInDb" />
    <q-btn label="Delete" @click="deleteInDb(form?.id)" />
    <!--<q-btn label="Delete single" @click="deleteDocById" />-->
  </div>
</template>

<script lang="ts">
import { getNode } from '@formkit/core';
import { mapper } from 'src/mappings/mapper';
import { excelTemplateFactory, uuidv4 } from 'src/models/v1';
import { useKatasterStore } from 'src/stores/kataster-store';
import { defineComponent, ref } from 'vue'
import { }
import * as _ from 'lodash'

interface VorlageForm {
  id: string,
  name: string,
  vorlage: File
}
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useKatasterStore()


    const values = ref([] as any[])
    const items = ref([] as any[])

    const form = ref(null as VorlageForm | null)

    const options = [
      { label: 'Name', value: { type: 'single', name: 'Name' } },
      { label: 'GK-Rechts', value: { type: 'single', name: 'GK-Rechts' } },
      { label: 'GK-Hoch', value: { type: 'single', name: 'GK-Hoch' } },
      { label: 'Breite', value: { type: 'single', name: 'Breite' } },
      { label: 'Länge', value: { type: 'single', name: 'Länge' } },
      { label: 'Dach', value: { type: 'single', name: 'Dach' } },
      { label: 'Gebäude', value: { type: 'single', name: 'Gebäude' } },

    ]

    async function createInDb() {
      const v = excelTemplateFactory.build()

      const v_mapped = mapper.map(v, 'VorlageExcelbericht', 'PouchVorlageExcelbericht')



      console.log(v, v_mapped)

      await store.getMasterDb.rel.save('template', v_mapped)
    }

    async function deleteDocById() {
      const ids = [
        '90a32023-3032-44d0-8a9e-2afb1b693512',
        '9df1d76f-0202-4f7e-974e-8d77acacb2a0',
        'a084f0bb-6965-4c2c-bda5-6d435bc78265',
        'a235ec91-71f8-47ad-b010-4888ac0ee5fb',
        'ccb784fc-9171-4a05-9b48-ecc5d9e815d3',
        'dbf0eb38-b302-4b95-a487-cc81687914bf',
        'f0caa729-d26e-4856-976d-5b79162c6c8b',
        'f103e8e8-6006-427d-899d-af797b1cc2bc',
      ]

      for (let id of ids) {
        const docs = (await store.getMasterDb.find({ selector: { _id: store.getMasterDb.rel.makeDocID({ type: 'template', id: id }) } }))
        console.log(docs)
        await store.getMasterDb.remove(docs.docs[0])
      }

    }

    const vorlagen = ref([] as any[])

    const vorlage = ref(null as any)

    async function readInDb() {

      const templates = (await store.getMasterDb.rel.find('template')).templates
      console.log('templates', templates)
      const mappedTemplates = templates.map((i: any) => mapper.map(i, 'PouchVorlageExcelbericht', 'VorlageExcelbericht'))
      console.log('mappedTemplates', mappedTemplates)

      vorlagen.value = mappedTemplates
      // fillForm(mappedTemplates[0])
    }


    function editSelected() {
      if (vorlage.value != null) {
        fillForm(vorlage.value)
      }
    }

    function deleteSelected() {
      if (vorlage.value != null) {
        deleteInDb(vorlage.value)
        readInDb()
      }
    }


    async function fillForm(args: any) {

      items.value = args.fields.map((i: any) => i.id)

      const node1 = getNode('form-1');
      await node1?.isSettled;
      console.log('Push now');
      form.value = { ...args }
      values.value = args.fields
      // form.value.values = args.fields
      // form.value.values = loadedValues.fields

    }


    async function updateInDb(args: any) {

      const bisher = (await store.getMasterDb.rel.find('template', args.id)).templates[0]

      console.log('bisher', bisher, 'update', args)

      if (args.file) {
        if (args.file?.file) {

          await store.getMasterDb.rel.putAttachment('template', { ...bisher, ...args }, 'template', args.file, args.file?.type)

        }
        else {
          // Do nothing
          const result = (await store.getMasterDb.rel.save('template', { ...bisher, ...args }))
          console.log(result)

        }
      } else {

        if (bisher.attachments) {
          await store.getMasterDb.rel.removeAttachment('template', { ...bisher, ...args }, 'template')
        } else {
          const result = (await store.getMasterDb.rel.save('template', { ...bisher, ...args }))
          console.log(result)
        }

      }

      readInDb()


    }

    async function deleteInDb(args: any) {
      const bisher = (await store.getMasterDb.rel.find('template', args.id)).templates[0]
      const deletion = (await store.getMasterDb.rel.del('template', bisher))

      console.log(bisher, deletion)
      readInDb()
    }


    async function loadValues() {
      // const v = excelTemplateFactory.build()
      // console.log(v)

      // const loadedValues = { fields: [{ column: 3, row: 34, id: uuidv4(), field: { ...options[1].value } }, { column: 3, row: 5, id: uuidv4(), field: { ...options[1].value } }] }

      // items.value = loadedValues.fields.map(i => i.id)

      // const node1 = getNode('form-1');
      // await node1?.isSettled;
      // console.log('Push now');
      // form.value.values = loadedValues.fields
    }



    function submitItem(args: any) {
      console.log('saving', args);
      if (args.file?.file) {
        console.log('Updated corresponding file')
      }

      // const mappedFormData = mapper.map(args, 'VorlageExcelbericht', 'VorlageExcelbericht')
      // console.log(mappedFormData)
      updateInDb(args)
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
      values, items, submitItem, addItem, removeItem, options, loadValues, form, createInDb, readInDb, updateInDb, deleteInDb, deleteDocById, vorlagen, vorlage, editSelected, deleteSelected
    }
  }
})
</script>
