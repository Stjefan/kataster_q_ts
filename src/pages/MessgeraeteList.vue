<template>
  <q-page padding>
    <!-- content -->
    <forms-messgeraet />
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import MessgeraetDetails from '../components/MessgeraetDetails.vue'
import FormsMessgeraet from 'src/components/FormsMessgeraet.vue'
import { Messgeraet, messgeraetFactory } from 'src/models/v1'
import { useKatasterStore } from '../stores/kataster-store'

export default defineComponent({
  components: {
    // MessgeraetDetails,
    FormsMessgeraet
  },
  // name: 'PageName'
  setup() {
    const store = useKatasterStore()

    const messgeraete = computed(() => store.messgeraete)
    const selectedMessgeraet = ref(null as Messgeraet | null)
    function create() {
      store.createMessgeraetBackend(messgeraetFactory.build())
    }

    function saveChanges() {
      if (selectedMessgeraet.value != null) {
        store.updateMessgeraetBackend(selectedMessgeraet.value)

      }

    }


    function remove() {
      const idx = 0
      store.$patch((state) => {
        state.messgeraete.splice(idx, 1)
      })
      selectedMessgeraet.value = null

    }

    return {
      messgeraete,
      selectedMessgeraet,
      create,
      remove,
      saveChanges
    }


  }
})
</script>
