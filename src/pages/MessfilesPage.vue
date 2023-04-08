<template>
  <q-page padding>
    <!-- content -->
    <forms-overview />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useKatasterStore } from 'src/stores/kataster-store';
import FormsOverview from 'src/components/FormsOverview.vue';
export default defineComponent({
  // name: 'PageName'
  components: {
    FormsOverview,

  },
  setup() {
    const store = useKatasterStore()

    const selectedOverview = ref('' as any)

    const upload = ref('')

    function push2server() {
      console.log('push2server')
      const file = upload.value.length > 0 ? upload.value[0] as unknown as File : null
      if (file != null) {
        store.sendOverview2Backend(file)

      }


    }

    function deleteSelected() {
      store.deleteOverview(selectedOverview.value.id)
    }



    return {
      store,
      selectedOverview,
      upload,
      push2server,
      deleteSelected
    }
  }
})
</script>
