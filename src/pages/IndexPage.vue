<template>
  <q-page class="row items-center justify-evenly">

    <div v-if="false">
      <q-btn label="Login" />
      <q-btn label="Logout" />
      <q-btn label="undo" @click="undo" />
      <q-btn label="redo" @click="redo" />
      <q-select :options="history" option-label="timestamp" v-model="selectedHistory" />
      <computed-rows :foo="foo" @create="handleCreate" @remove="handleRemove" @update:bCol="handleUpdateBCol" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import ComputedRows from 'components/ComputedRows.vue'
import { ref } from 'vue';


import { useRefHistory } from '@vueuse/core'

let idCounter = 1

const selectedHistory = ref(null)
const foo = ref([{
  id: 1,
  propA: { a: 10, b: 43, vorhanden: true },
  propB: { a: 15, b: 99, vorhanden: true }
}])

function handleCreate() {
  foo.value.push({
    id: ++idCounter,
    propA: { a: 13, b: 41, vorhanden: true },
    propB: { a: 17, b: 96, vorhanden: false }
  })
}


const { history, undo, redo } = useRefHistory(foo, {
  deep: true,
})



function handleUpdateBCol(args: any) {
  console.log(args)
  const idx = foo.value.findIndex(i => i.id == args.target)
  if (idx != -1) {
    foo.value[idx].propA.a = args.val
  }

}
function handleRemove(id: number) {
  const pos = foo.value.findIndex(i => i.id === id)
  if (pos !== -1)
    foo.value.splice(pos, 1)
}

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1'
  },
  {
    id: 2,
    content: 'ct2'
  },
  {
    id: 3,
    content: 'ct3'
  },
  {
    id: 4,
    content: 'ct4'
  },
  {
    id: 5,
    content: 'ct5'
  }
]);
const meta = ref<Meta>({
  totalCount: 1200
});
</script>
