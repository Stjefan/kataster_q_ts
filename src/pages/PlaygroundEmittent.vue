<template>
  <q-page padding>
    <!-- content -->
    <div v-for="val in values" :key="val.id">
      <q-input type="text" :disable="true" v-model="val.id" />
      <q-file v-model="val.file" />
      <q-btn label="Anzeigen" @click="showPdf(val)" />
      <div v-if="val.bisher">
        bisher: {{ val.filename }}
      </div>

      <q-btn label="-" @click="deleteItem(val.id)" />
    </div>
    <q-btn label="+" @click="addItem" />
    <br />
    <q-btn label="Commit" @click="saveValues" />
    <br />
    <button @click="loadEmittent">Load</button>
    <button @click="funWithEmittent">Get Attachements</button>
    <button @click="putAttachements">Put Attachements</button>
    <button @click="loadSpecificDoc">specificDoc</button>
    <br />
    {{ values }}
    <luftschadstoffe-component v-if="false" />
    <br />
    <p>Eröffnen Sie eine PDF-Datei <a :href="exampleUrl">zum Beispiel</a>.</p>
    <iframe :src="exampleUrl"></iframe>
  </q-page>
</template>

<script lang="ts">
import { getNode } from '@formkit/core'
import LuftschadstoffeComponent from 'src/components/LuftschadstoffeComponent.vue'
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  components: { LuftschadstoffeComponent },
  // name: 'PageName'
  setup() {
    const store = useKatasterStore()

    const formContent = ref({})

    const values = ref([{ id: uuidv4(), blub: 'Gogo', bisher: null, file: null }, { id: uuidv4(), bisher: null, file: null }] as any[])
    const items = ref([uuidv4(), uuidv4()])
    const name = ref('')

    async function loadSpecificDoc() {
      const result = (await store.getDb.rel.find('article', article_id)).articles[0]

      console.log(result)
      items.value = result.permissions.map((i: any) => i.id)
      const node1 = getNode('form-1');
      await node1?.isSettled;
      console.log('Push now');


      values.value = result.permissions.map((i: any) => ({ id: i.id, bisher: result.attachments[i.id], filename: i.filename })) //[{ id: uuidv4() }, { id: uuidv4() }]


      // console.log(result.attachments['1ef88960-e3ab-4789-bc39-727824f6a552'])
      result.permissions.forEach(async (element: any) => {
        try {
          const a = await store.getDb.rel.getAttachment('article', article_id, element.id)
          console.log(a)
        } catch (ex) {
          console.log(element.id, 'not found')
        }
      });

      // console.log(a)
      console.log(values.value)





    }


    async function saveValues() {
      console.log(values.value)
      const result = (await store.getDb.rel.find('article', article_id)).articles[0]


      const obj = values.value.filter((i: any) => i.file != null).reduce((o: any, i: any) => ({
        ...o, [`${i.id}`]: {
          data: i.file,
          content_type: i.file.type
        }
      }), {})

      console.log('biserh')

      console.log('New attachments-obj', obj)

      // console.log(result)



      const base = await store.getDb.get(store.getDb.rel.makeDocID({ type: 'article', 'id': article_id }))



      const data2save = { ...(base as any).data, permissions: values.value.map((i: any) => ({ id: i.id, filename: i.file?.name ?? i.filename })) }
      let myAttachments = obj
      console.log('base', base, '2svae', data2save)
      if (base._attachments != null) {
        values.value.forEach(i => {
          if (i.id != null && i.file == null) {
            console.log(base._attachments![i.id])
            myAttachments = { ...myAttachments, [i.id]: base._attachments![i.id] }
          }
        })
      }

      console.log(myAttachments)


      const putResult = await store.getDb.put({
        _id: base._id, //store.getDb.rel.makeDocID({ type: 'article', 'id': 'cd6e70c8-42be-411e-8c77-ed2c50b0c93d' }),
        _rev: base._rev,
        _attachments: myAttachments,
        data: data2save
      });
      console.log('putResult', putResult)

    }

    const article_id = '7554044f-fbbd-482a-b886-91ef74058002'

    async function loadEmittent() {
      console.log('loading...')
      // store.getDb.rel.makeDocID({ type: 'article', 'id': 'cd6e70c8-42be-411e-8c77-ed2c50b0c93d' }
      const result = (await store.getDb.rel.find('article', article_id)).articles[0]

      console.log(result)

    }

    async function funWithEmittent() {
      console.log(await store.getDb.rel.save('article', {
        id: uuidv4(),
        name: 'X', ads: [{
          name: 'a',
          id: uuidv4()
        }, {
          name: 'b',
          id: uuidv4()
        }]
      }))


    }

    async function putAttachements() {
      const result = (await store.getDb.rel.find('article'))
      console.log(result)

    }

    const exampleUrl = ref('')

    async function showPdf(value: any) {
      if (value.file != null) {
        exampleUrl.value = URL.createObjectURL(value.file as Blob)

      } else {
        const a = await store.getDb.rel.getAttachment('article', article_id, value.id)
        console.log(a)
        exampleUrl.value = URL.createObjectURL(a as Blob)
      }


    }

    const addItem = () => {
      // items.value.push(uuidv4())
      values.value.push({ id: uuidv4(), blub: 'Gogo', bisher: null, file: null })
    }

    const deleteItem = (e: any) => {
      //e.preventDefault()
      //const key = e.target.getAttribute('data-key')
      //console.log(items.value, key)
      // console.log([...items.value])
      // items.value = items.value.filter(item => item !== key)
      // console.log([...items.value])
      values.value = values.value.filter(item => item.id !== e)
    }

    return {
      saveValues,
      addItem,
      deleteItem,
      putAttachements,
      funWithEmittent,
      formContent,
      name,
      loadEmittent,
      values,
      items,
      loadSpecificDoc,
      showPdf,
      exampleUrl
    }





  }
})
</script>
