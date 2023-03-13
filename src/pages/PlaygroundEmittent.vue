<template>
  <q-page padding>
    <!-- content -->
    <form-kit type="form" @submit="submitHandler" id="form-1">
      <FormKit type="list" v-model="values" name="permissions">

        <FormKit v-for="key in items" :key="key" :id="key" type="group" label="Group">
          <form-kit type="text" name="id" disabled></form-kit>

          <form-kit type="file" name="blub"></form-kit>
          <div></div>
          <button class="formkit-remove" :data-key="key" href="#" @click="removeItem">-</button>
        </FormKit>
        <br />
        <button type="button" @click.prevent="addItem">Messung hinzufügen</button>
      </FormKit>
    </form-kit>
    <button @click="loadEmittent">Load</button>
    <button @click="funWithEmittent">Get Attachements</button>
    <button @click="putAttachements">Put Attachements</button>
    <button @click="loadSpecificDoc">specificDoc</button>
    {{ values }}
    <luftschadstoffe-component v-if="false" />
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

    const values = ref([{ id: uuidv4(), blub: 'Gogo', bisher: null }, { id: uuidv4(), bisher: null }] as any[])
    const items = ref([uuidv4(), uuidv4()])
    const name = ref('')

    async function loadSpecificDoc() {
      const result = (await store.getDb.rel.find('article', article_id)).articles[0]

      console.log(result)
      items.value = result.permissions.map((i: any) => i.id)
      const node1 = getNode('form-1');
      await node1?.isSettled;
      console.log('Push now');


      values.value = result.permissions.map((i: any) => ({ id: i.id, correspondingFile: result.attachments[i.id] })) //[{ id: uuidv4() }, { id: uuidv4() }]


      // console.log(result.attachments['1ef88960-e3ab-4789-bc39-727824f6a552'])
      result.permissions.forEach(async (element: any) => {
        const a = await store.getDb.rel.getAttachment('article', article_id, element.id)
        console.log(a)
      });

      // console.log(a)
      console.log(values.value)





    }

    async function submitHandler(args: any) {
      console.log('Args', args)
      const result = (await store.getDb.rel.find('article', article_id)).articles[0]
      if (false) {
        for (const g of args.permissions) {
          const file = g.blub[0].file
          const result = (await store.getDb.rel.find('article', '2454aca2-386c-41d9-9079-29a6262a829d')).articles[0]
          const updateResult = await store.getDb.rel.putAttachment('article', { ...result }, `${g.id}`, file, file.type)
          console.log(updateResult)
        }
      }
      const mapped = args.permissions.filter((i: any) => i.length > 0).map((i: any) => ({
        [`${i.id}`]: {
          data: i.blub[0].file,
          content_type: i.blub[0].file.type
        }
      }))

      const obj = args.permissions.filter((i: any) => i.blub.length > 0).reduce((o: any, i: any) => ({
        ...o, [`${i.id}`]: {
          data: i.blub[0].file,
          content_type: i.blub[0].file.type
        }
      }), {})

      console.log('attachments-obj', obj)
      // console.log(result)



      const base = await store.getDb.get(store.getDb.rel.makeDocID({ type: 'article', 'id': article_id }))

      const data2save = { ...(base as any).data, permissions: args.permissions.map((i: any) => ({ id: i.id })) }
      console.log('No attachments', base, '2svae', data2save)
      const putResult = await store.getDb.put({
        _id: base._id, //store.getDb.rel.makeDocID({ type: 'article', 'id': 'cd6e70c8-42be-411e-8c77-ed2c50b0c93d' }),
        _rev: base._rev,
        _attachments: obj,
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

    return {
      addItem,
      removeItem,
      putAttachements,
      funWithEmittent,
      submitHandler,
      formContent,
      name,
      loadEmittent,
      values,
      items,
      loadSpecificDoc
    }





  }
})
</script>
