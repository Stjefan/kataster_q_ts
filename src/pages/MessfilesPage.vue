<template>
  <q-page padding>
    <!-- content -->
    <q-select :options="store.overviews" v-model="selectedOverview" option-label="upload" />

    <q-input label="Overview-Upload" v-model="upload" type="file" />
    <q-btn label="Hochladen" @click="push2server" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useKatasterStore } from 'src/stores/kataster-store';
export default defineComponent({
  // name: 'PageName'
  setup() {
    const store = useKatasterStore()

    const selectedOverview = ref('')

    const upload = ref('')

    function push2server() {
      console.log('push2server')
      const file = upload.value.length > 0 ? upload.value[0] as unknown as File : null
      if (file != null) {
        store.sendOverview2Backend(file)

      }


    }





    return {
      store,
      selectedOverview,
      upload,
      push2server
    }
  }
})
</script>
