<template>
  <q-page padding>
    <!-- content -->
    <q-btn label="Neues Messgerät anlegen" @click="create" />
    <q-select v-model="selectedMessgeraet" :options="messgeraete" option-label="name" />
    <div v-if="selectedMessgeraet">
      <messgeraet-details v-model:name="selectedMessgeraet.name" @remove="remove" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import MessgeraetDetails from '../components/MessgeraetDetails.vue'
import { Messgeraet, messgeraetFactory } from 'src/models/v1'
import { useKatasterStore } from '../stores/kataster-store'

export default defineComponent({
  components: { MessgeraetDetails },
  // name: 'PageName'
  setup() {
    const store = useKatasterStore()

    const messgeraete = computed(() => store.messgeraete)
    const selectedMessgeraet = ref(null as Messgeraet | null)
    function create() {
      store.$patch((state) => {
        state.messgeraete.push(messgeraetFactory.build())
      })

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
      remove
    }


  }
})
</script>
