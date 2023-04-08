<template>
  <q-btn label="Read" @click="readDocs" />
  <q-select v-model="selectedItem" :options="options" option-label="name" />
  <q-btn label="Delete" @click="deleteDoc" />
  <q-btn label="Edit" @click="editSelected" />
  <q-btn label="Create" @click="editSelected" />
  <div>Details:</div>
  <FormKit type="form" @submit="handleSubmit" id="form-emittent" v-model="form">
    <FormKit type="text" label="ID" name="id" :disabled="true" />
    <FormKit type="text" label="Filename" name="filename" :modelValue="filename" :disabled="true" />
    <FormKit type="file" name="image" label="Bild" v-model="fileInput" accept=".png,.bmp,.jpg" />
    <img :src="imagePreviewUrl" v-if="imagePreviewUrl" style="max-height: 20vh;" />
    <FormKit type="text" label="Bezeichnung" name="name" validation="required" />
    <FormKit type="textarea" label="Bemerkung" name="bemerkung" rows="5" />
    <FormKit type="text" label="Bearbeiter" name="bearbeiter" />
    <FormKit type="text" label="Kostenstelle" name="kostenstelle" />
    <FormKit type="text" label="Abteilung" name="abteilung" />
    <FormKit type="text" label="Anlage" name="anlage" />
    <FormKit type="number" label="Höhe" name="hoehe" :plugins="[castNumber]" />
    <FormKit type="number" label="GK-Rechts" name="gkRechts" :plugins="[castNumber]" />
    <FormKit type="number" label="GK-Hoch" name="gkHoch" :plugins="[castNumber]" />
    <FormKit type="checkbox" label="In Betrieb" name="inBetrieb" />
    <FormKit type="checkbox" label="Zur Messung vormerken" name="zurMessungVorgmerkt" />
    <FormKit type="checkbox" label="an Fassade" name="liegtAnFassade" />

    <FormKit type="list" v-model="values" id="form-messungen" name="messungen">
      <FormKit v-for="key in items" :key="key" type="group" label="Group">
        <div class="row">
          <forms-schallmessung />
          <!--
          <FormKit type="text" name="id" label="ID" :disabled="true" />
          <FormKit type="text" name="type" label="Messverfahren" :disabled="true" />
          <FormKit type="date" name="datum" label="Messdatum" :disabled="true" />
          -->
          <FormKit type="button" :data-key="key" href="#" @click="removeItem" label="Entfernen" />

        </div>

      </FormKit>
    </FormKit>
    <button @click.prevent="addItem">Messung hinzufügen</button>

  </FormKit>
</template>

<script lang="ts">
import { getNode } from '@formkit/core'
import { mapper } from 'src/mappings/mapper'
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { defineComponent, ref, computed } from 'vue'
import { castNumber } from 'src/utility/errorHandling'
import FormsSchallmessung from './FormsSchallmessung.vue'
import * as _ from 'lodash'
export default defineComponent({
  // name: 'ComponentName'
  components: { FormsSchallmessung },
  setup() {
    const form = ref(null as any)
    const store = useKatasterStore()
    const fileInput = ref(null as any)
    //const imagePreviewUrl = ref(null as string | null)
    const values = ref([] as any[])
    const items = ref([] as string[])
    const imagePreviewUrl = computed(() => {
      console.log('imagePreviewUrl triggered')
      if (fileInput.value?.length) {
        console.log(fileInput.value)
        if (fileInput.value[0].file != null) {
          return URL.createObjectURL(fileInput.value[0].file);
        } else return null
      } else {
        return null
      }

    })

    const filename = computed(() => {
      console.log('computed filename')
      if (fileInput.value?.length) {
        console.log(fileInput.value)
        if (fileInput.value[0].name != null) {
          return fileInput.value[0].name
        } else return null
      } else {
        return null
      }


    })

    async function deleteDoc() {
      if (selectedItem.value != null) {
        const docs = await store.getDb.rel.find('emittent', selectedItem.value.id)
        const fromDb = docs.emittents[0]

        await store.getDb.rel.del('emittent', fromDb)

        readDocs()
      }

    }


    const selectedItem = ref(null as any)
    const options = ref([] as any[])

    async function readDocs() {
      console.log('read')
      const bisherDocs = await store.getDb.rel.find('emittent')
      console.log(bisherDocs.emittents)
      const mapped = mapper.mapArray(bisherDocs.emittents, 'PouchEmittent', 'EmittentDetailsForm')
      console.log('mapped', mapped)
      options.value = mapped
    }
    async function handleSubmit(args: any) {
      console.log(args)



      if (args.image.length) {
        const file = args.image[0]

        const mapped = mapper.map(args, 'EmittentDetailsForm', 'PouchEmittent')
        console.log(args, mapped)

        if (true) {
          let saveResult
          if (args.id) {
            console.log('Bereits vorhanden')
            const bisherDocs = await store.getDb.rel.find('emittent', args.id)
            const bisher = bisherDocs.emittents[0]
            saveResult = await store.getDb.rel.save('emittent', { ...bisher, ...mapped })
          } else {
            saveResult = await store.getDb.rel.save('emittent', { ...mapped, ...mapped })
          }


          console.log('Save-result', saveResult)

          const currentlyCreated = await store.getDb.rel.find('emittent', saveResult.id)

          const current = currentlyCreated.emittents[0]

          console.log('currentlyCreated', currentlyCreated)

          if (file.file != null && !(_.isEmpty(file.file))) {
            console.log(file.file, _.isEmpty(file.file))
            await store.getDb.rel.putAttachment('emittent', current, 'image', file.file, file.file.type)
          }

        }

      }
    }

    async function addItem() {
      const val = { typ: '1P', id: uuidv4() }
      values.value.push(val)

      const node1 = getNode('form-messungen');
      console.log('node1', node1)
      console.log(getNode('blabla'))
      await node1?.isSettled;

      items.value.push(val.id)
    }

    function removeItem(e: any) {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(items.value, key)

      items.value = items.value.filter(item => item !== key)
    }




    function handleUpdateImage(eventArgs: any) {
      console.log(eventArgs)
      if (fileInput.value?.length) {
        console.log(fileInput.value)
        if (fileInput.value[0].file != null) {
          //imagePreviewUrl.value = URL.createObjectURL(fileInput.value[0].file);
          //filename.value = fileInput.value[0].name
        }
      } else {

        //imagePreviewUrl.value = null
        // filename.value = null
      }
    }

    async function editSelected() {
      console.log('editSelected')

      const mapped = mapper.map<any, any>(selectedItem.value, 'EmittentDetailsForm', 'EmittentDetailsForm')

      console.log(selectedItem.value, mapped,)

      form.value = mapped
      const node1 = getNode('form-emittent');

      await node1?.isSettled;
      // items.value = mapped.georeferenzierung.referenzierungspunkt_set.map((i: any) => i.id)
      // values.value = mapped.georeferenzierung.referenzierungspunkt_set

      await node1?.isSettled;

      values.value = []

      const imageMap = await store.getDb.rel.getAttachment('emittent', selectedItem.value.id, 'image')
      console.log(imageMap)
      // imagePreviewUrl.value = URL.createObjectURL(imageMap as Blob);

      form.value.image = [{ name: selectedItem.value.filename, file: imageMap }]
    }



    return {
      imagePreviewUrl,
      handleSubmit,
      handleUpdateImage,
      fileInput,
      items,
      values,
      addItem, removeItem, readDocs, deleteDoc, selectedItem, options, form, editSelected, filename, castNumber
    }
  }
})
</script>
