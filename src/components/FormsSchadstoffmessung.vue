<template>
  <q-btn label="Lesen" @click="readMessung" />
  <q-btn label="Compare attachments" @click="loadAttachments" />
  <FormKit type="form" @submit="sub" name="form-messungen" label="Messung">


    <FormKit type="list" v-model="valuesMessungen" name="messungen">

      <FormKit v-for="key in itemsMessungen" :key="key" type="group" label="Group">
        <q-expansion-item expand-separator icon="assessment" label="Messung" :caption="key">
          <FormKit label="Grenzwert" name="grenzwert" type="number" :plugins="[castNumber]" />
          <FormKit label="Gemessener Abluftvolumenstrom" name="gemessenerAbluftvolumenstrom" type="number"
            :plugins="[castNumber]" />
          <FormKit label="Genehmigter Abluftvolumenstrom" name="genehmigterAbluftvolumenstrom" type="number"
            :plugins="[castNumber]" />
          <FormKit label="Austrtrittsfläche" name="austrittsfläche" type="number" :plugins="[castNumber]" />
          <FormKit label="Abluftkonzentration" name="abluftkonzentration" type="number" :plugins="[castNumber]" />
          <FormKit label="Austrittsgeschwindigkeit" name="austrittsgeschwindigkeit" type="number"
            :plugins="[castNumber]" />
          <FormKit label="Ableitbedingungen erfüllt" name="ableitbedingungenErfüllt" type="checkbox" />
          <FormKit label="Geruchsrelevanz" name="geruchsrelevanz" type="checkbox" />
          <FormKit label="Files" name="file" type="file" multiple />
          <FormKit label="Messdatum" name="datum" type="date" />
          <FormKit label="Bemerkung" name="bemerkung" type="text" />
          <button class="formkit-remove" :data-key="key" href="#" @click="removeItemMessung">-</button>
        </q-expansion-item>
      </FormKit>

    </FormKit>
    <br />
    <button type="button" @click.prevent="addItemMessung">Messung hinzufügen</button>

  </FormKit>
  <q-btn label="Save LuftschadstoffMessung" @click="saveLuftschadstoffMessung" />



  <FormKit type="form" @submit="subGenehmigung" name="form-genehmigungen">
    <FormKit type="list" v-model="values" name="genehmigungen">

      <FormKit v-for="key in items" :key="key" :id="key" type="group" label="Group">
        <q-expansion-item expand-separator icon="receipt" label="Genehmigung" :caption="key">
          <FormKit label="ID" name="id" hidden />
          <FormKit label="Aktenzeichen" name="aktenzeichen" />
          <FormKit label="Bezeichnung" name="name" type="text" />
          <FormKit label="pdf" name="file" type="file" multiple />
          <FormKit label="gültig bis" name="gueltigBis" type="date" />
          <button class="formkit-remove" :data-key="key" href="#" @click="removeItem">-</button>
        </q-expansion-item>
      </FormKit>
    </FormKit>
    <br />
    <button type="button" @click.prevent="addItem">Genehmigung hinzufügen</button>
  </FormKit>

  <q-btn label="Submit all" @click="saveAll" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { luftschadstoffeFactory, genehmigungFactory, luftschaffMessungFactory, LuftschadstoffMessung, LuftschadstoffGenehmigung, EmittentDetails } from 'src/models/v1'
import { token } from '@formkit/utils'
import { useKatasterStore, } from '../stores/kataster-store'
import { uuidv4 } from 'src/models/v1'
import { getNode } from '@formkit/core'
import { mapper } from 'src/mappings/mapper'
import * as _ from 'lodash'




export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const castNumber = (node: any) => {
      node.hook.input((value: any, next: any) => next(Number(value)))
    }

    const id = '1482a1d2-0da7-4046-877a-1f8f81ec000f'
    async function readMessung() {

      const docs = await store.getDb.rel.find('emittent', id)
      console.log(docs.emittents)
      // const emittent = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
      //   console.log('Aus db:', emittent, 'Original', this.emittentSource, 'Modified', e_bar)
      //   const r = mapper.map<EmittentDetails, PouchEmittent>(e_bar, 'EmittentDetails', 'PouchEmittent')
      prepareForm(docs.emittents[0])

      prepareFormGenhmigungen(docs.emittents[0])


    }

    async function prepareFormGenhmigungen(arg: EmittentDetails) {
      arg.luftschadstoffe.genehmigungen = arg.luftschadstoffe.genehmigungen ?? []
      items.value = arg.luftschadstoffe.genehmigungen.map(i => i.id ?? uuidv4())
      const node1 = getNode('form-genehmigungen');
      await node1?.isSettled;
      // console.log('Push now');
      // form.value.values = loadedValues.fields
      // const mappedStep1 = arg.luftschadstoffe.genehmigungen

      const mappedStep1 = arg.luftschadstoffe.genehmigungen.map(i => mapper.map(i, 'PouchLuftschadstoffgenehmigung', 'Luftschadstoffgenehmigung'))
      console.log('mappedStep1', mappedStep1)

      const mappedStep2 = mappedStep1.map(i => mapper.map(i, 'Luftschadstoffgenehmigung', 'GenehmigungForm'))
      for (let i = 0; i < mappedStep2.length; i++) {
        const current = arg.luftschadstoffe.genehmigungen[i].file
        if (current != null) {
          (mappedStep2[i] as any).file = [{ name: current.name }]

        }

      }



      values.value = mappedStep2

      // if (i.file != null)
      //   i.file = [{ name: i.filename }]



    }

    async function prepareForm(arg: EmittentDetails) {
      itemsMessungen.value = arg.luftschadstoffe.messungen.map(i => i.id ?? uuidv4())
      const node1 = getNode('form-messungen');
      await node1?.isSettled;
      // console.log('Push now');
      // form.value.values = loadedValues.fields
      const mappedStep1 = arg.luftschadstoffe.messungen.map(i => mapper.map(i, 'PouchLuftschadstoffmessung', 'Luftschadstoffmessung'))
      console.log('mappedStep1', mappedStep1)
      const mappedStep2 = mappedStep1.map(i => mapper.map(i, 'Luftschadstoffmessung', 'LuftschadstoffeForm'))
      for (let i = 0; i < mappedStep2.length; i++) {
        if (arg.luftschadstoffe.messungen[i].file != null) {
          (mappedStep2[i] as any).file = [{ name: arg.luftschadstoffe.messungen[i].file.name }]

        }

      }
      valuesMessungen.value = mappedStep2
      console.log('Mapped', valuesMessungen.value)
      valuesMessungen.value.forEach(i => {
        // if (i.file != null)
        //   i.file = [{ name: i.filename }]
      })

    }

    async function updateLuftschadstoffe(arg: any) {
      const docs = await store.getDb.rel.find('emittent', id)
      // const emittent = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
      //   console.log('Aus db:', emittent, 'Original', this.emittentSource, 'Modified', e_bar)
      //   const r = mapper.map<EmittentDetails, PouchEmittent>(e_bar, 'EmittentDetails', 'PouchEmittent')
      const bisher = docs.emittents[0]

      bisher.luftschadstoffe.messungen = arg.messungen

      for (let i of arg.messungen) {
        console.log('file', i.file)
      }
      // await store.getDb.rel.save('emittent', bisher)
      handleUploadedFilesWithinDoc(arg.messungen)

    }

    async function loadAttachments(args: any) {
      console.log('???')
      const base = await store.getDb.get(store.getDb.rel.makeDocID({ type: 'emittent', 'id': id }))
      console.log(base._attachments)

    }

    const fileaccessor = (i: any) => i.file[0]

    async function handleUploadedFilesWithinDoc(args: any) {

      args.forEach((i: any, idx: number) => {
        i.id = i.id ?? uuidv4()
      });


      const attachmentsFromForm = args.filter((i: any) => i.file.length > 0 && fileaccessor(i).file).reduce((o: any, i: any) => ({
        ...o, [`${i.id}`]: {
          data: fileaccessor(i)?.file,
          content_type: fileaccessor(i)?.file.type
        }
      }), {})

      console.log('New attachments-obj', attachmentsFromForm)

      const base = await store.getDb.get(store.getDb.rel.makeDocID({ type: 'emittent', 'id': id }))


      console.log('ids bisher', (base as any).data.luftschadstoffe.messungen.map((i: any) => i.id))
      console.log('ids jetzt', args.map((i: any) => i.id))

      const bisher = (base as any).data.luftschadstoffe.messungen.map((i: any) => i.id)
      const afterModification = args.map((i: any) => i.id)

      const deleted = _.difference(bisher, afterModification)

      const luftschaddstoffmessugen = args.map((i: any) => mapper.map(i, 'LuftschadstoffeForm', 'Luftschadstoffmessung'))

      console.log('Mapping', luftschaddstoffmessugen)

      console.log('Mapping 2nd step', luftschaddstoffmessugen.map((i: any) => mapper.map(i, 'Luftschadstoffmessung', 'PouchLuftschadstoffmessung')))

      const data2save = { ...(base as any).data, ...{ luftschadstoffe: { messungen: luftschaddstoffmessugen.map((i: any) => mapper.map(i, 'Luftschadstoffmessung', 'PouchLuftschadstoffmessung')) } } }

      console.log('base', base)
      console.log('2svae', data2save)




      let updatedAttachments = { ...base._attachments, ...attachmentsFromForm }
      if (base._attachments != null) {
        deleted.forEach((i: any) => {
          console.log('Delete', i)
          delete updatedAttachments[i]
        })


        args.forEach((i: any) => {
          if (i.id != null) {
            console.log('Current iterate', i, fileaccessor(i) == null)
            if (fileaccessor(i) == null) {
              console.log('Lösche bisheriges attachment', updatedAttachments[i.id])

              delete updatedAttachments[i.id]

            }


          }
        })
      }



      console.log(updatedAttachments)


      const putResult = await store.getDb.put({
        _id: base._id, //store.getDb.rel.makeDocID({ type: 'article', 'id': 'cd6e70c8-42be-411e-8c77-ed2c50b0c93d' }),
        _rev: base._rev,
        _attachments: updatedAttachments,
        data: data2save
      });
      console.log('putResult', putResult)

    }

    function saveAll() {
      for (const curr of luftschadstoffe.value.messungen) {
        curr.id = curr.id ?? uuidv4()
      }
      for (const curr of luftschadstoffe.value.genehmigungen) {
        curr.id = curr.id ?? uuidv4()
      }

      store.saveLuftschadstoffe(luftschadstoffe.value)
    }
    const store = useKatasterStore()
    console.log('Luftschadstoffe', store.emittent!.luftschadstoffe)
    const luftschadstoffe = ref(store.emittent!.luftschadstoffe)


    const messung = ref(store.emittent!.luftschadstoffe.messungen[0])

    function addGenehmigung() {
      luftschadstoffe.value.genehmigungen.push(genehmigungFactory.build())
    }
    const selectedMessung = ref(null as LuftschadstoffMessung | null)
    const selectedGenehmigung = ref(null as LuftschadstoffGenehmigung | null)
    function addMessung() {
      luftschadstoffe.value.messungen.push(luftschaffMessungFactory.build())
    }
    function deleteMessung() {
      if (selectedMessung.value != null) {
        const idx = luftschadstoffe.value.messungen.findIndex(i => i.id == selectedMessung.value!.id)
        luftschadstoffe.value.messungen.splice(idx, 1)
        selectedMessung.value = null
      }
    }
    function deleteGenehmigung() {
      if (selectedGenehmigung.value != null) {
        const idx = luftschadstoffe.value.genehmigungen.findIndex(i => i.id == selectedGenehmigung.value!.id)
        luftschadstoffe.value.genehmigungen.splice(idx, 1)
        selectedGenehmigung.value = null
      }
    }

    const results = ref(null as any)
    function sub(args: any) {
      console.log(args)
      results.value = args
      console.log(args.messungen)
      updateLuftschadstoffe(args)
    }

    async function subGenehmigung(eventArgs: any) {
      console.log(eventArgs)

      const args = eventArgs.genehmigungen

      args.forEach((i: any, idx: number) => {
        i.id = i.id ?? uuidv4()
      });


      const attachmentsFromForm = args.filter((i: any) => i.file.length > 0 && fileaccessor(i).file).reduce((o: any, i: any) => ({
        ...o, [`${i.id}`]: {
          data: fileaccessor(i)?.file,
          content_type: fileaccessor(i)?.file.type
        }
      }), {})

      console.log('New attachments-obj', attachmentsFromForm)

      const base = await store.getDb.get(store.getDb.rel.makeDocID({ type: 'emittent', 'id': id }))


      console.log('ids bisher', (base as any).data.luftschadstoffe.genehmigungen?.map((i: any) => i.id))
      console.log('ids jetzt', args.map((i: any) => i.id))

      // const bisher = (base as any).data.luftschadstoffe.genehmigungen?.map((i: any) => i.id)
      // const afterModification = args.map((i: any) => i.id)

      const deleted = [] as any[] // _.difference(bisher, afterModification)

      const genehmigungen = args.map((i: any) => mapper.map(i, 'GenehmigungForm', 'Luftschadstoffgenehmigung'))

      console.log('Mapping', genehmigungen)

      const mappedStep2 = genehmigungen.map((i: any) => mapper.map(i, 'Luftschadstoffgenehmigung', 'PouchLuftschadstoffgenehmigung'))

      console.log('Mapping 2nd step', mappedStep2)

      const data2save = { ...(base as any).data }

      data2save.luftschadstoffe.genehmigungen = mappedStep2

      console.log('base', base)
      console.log('2 save', data2save)




      let updatedAttachments = { ...base._attachments, ...attachmentsFromForm }
      if (base._attachments != null) {
        deleted.forEach((i: any) => {
          console.log('Delete', i)
          delete updatedAttachments[i]
        })


        args.forEach((i: any) => {
          if (i.id != null) {
            console.log('Current iterate', i, fileaccessor(i) == null)
            if (fileaccessor(i) == null) {
              console.log('Lösche bisheriges attachment', updatedAttachments[i.id])

              delete updatedAttachments[i.id]

            }


          }
        })
      }



      console.log(updatedAttachments)


      const putResult = await store.getDb.put({
        _id: base._id, //store.getDb.rel.makeDocID({ type: 'article', 'id': 'cd6e70c8-42be-411e-8c77-ed2c50b0c93d' }),
        _rev: base._rev,
        _attachments: updatedAttachments,
        data: data2save
      });
      console.log('putResult', putResult)








    }

    const list = ref([{ 'name': 'X' }, { 'name': 'Y' }])

    const values = ref([] as any[])

    // Iterating over this:
    const items = ref(values.value.map(i => uuidv4()).concat([uuidv4()]))

    const addItem = () => {
      items.value.push(uuidv4())
    }

    const removeItem = (e: any) => {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(items.value, key)
      console.log([...items.value])
      items.value = items.value.filter(item => item !== key)
      console.log([...items.value])
    }

    const valuesMessungen = ref([] as any[])

    // Iterating over this:
    const itemsMessungen = ref(valuesMessungen.value.map(i => token()).concat([token()]))

    const addItemMessung = () => {
      itemsMessungen.value.push(uuidv4())
    }

    const removeItemMessung = (e: any) => {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(itemsMessungen.value, key)
      console.log([...itemsMessungen.value])
      itemsMessungen.value = itemsMessungen.value.filter(item => item !== key)
      console.log([...itemsMessungen.value])
    }


    function saveLuftschadstoffMessung() {
      const curr = results.value.messungen[0]
      curr.id = uuidv4()
      console.log('saving', curr)
      store.saveLuftschadstoffMessung({ id: curr.id }, curr.file[0].file)
    }

    const allMessungen = ref([] as any[])

    function submitSingleMessung(args: any) {
      results.value = args
      console.log(results)
      const curr = results.value
      curr.id = curr.id ?? uuidv4()

      console.log('saving', curr)
      store.saveLuftschadstoffMessung(curr, curr.file[0]?.file)
    }


    return {
      castNumber,
      readMessung,

      messung,
      submitSingleMessung,
      saveLuftschadstoffMessung,
      valuesMessungen,
      itemsMessungen,
      addItemMessung,
      removeItemMessung,

      addItem,
      removeItem,
      items,
      values,
      selectedMessung,
      selectedGenehmigung,
      luftschadstoffe,
      addMessung,
      addGenehmigung,
      deleteMessung,
      deleteGenehmigung,
      sub,
      subGenehmigung,
      list,
      saveAll,
      loadAttachments

    }
  }
})
</script>
