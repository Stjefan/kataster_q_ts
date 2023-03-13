<template>
  <button>Neues Projekt</button>
  <button>Projekt ändern</button>
  <q-select v-model="option" :options="options" option-label="name" />
  <FormKit type="form" name="x" @submit="submitItem" :config="{ validationVisibility: 'submit' }" v-model="item">
    <FormKit type="text" label="Name" name="name" />
    <FormKit type="text" label="name_database" name="name_database" disabled />

  </FormKit>
  <div class="row">
    <button @input.prevent="deleteItem">Löschen</button>
    <button>Sync mit Remote-Datenbank</button>
  </div>
  {{ item }}
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const options = ref([{ name: 'A', name_database: 'db_a' }, { name: 'b', name_database: 'db_b' }])
    const option = ref(null)
    const item = ref({})
    return {
      options,
      option,
      item,
      deleteItem(eventArgs: unknown) {
        console.log('deleteItem')
      },
      submitItem(eventArgs: unknown) {
        console.log(eventArgs)

      }
    }
  }
})
</script>
