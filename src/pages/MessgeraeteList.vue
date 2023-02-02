<template>
  <q-page padding>
    <!-- content -->
    <q-btn label="Neues Messgerät anlegen" @click="create" />
    <q-select v-model="selectedMessgeraet" :options="messgeraete" option-label="name" />
    <div v-if="selectedMessgeraet">
      <messgeraet-details v-model:name="selectedMessgeraet.name" @remove="remove" @save="saveChanges"
        v-model:offsetLines="selectedMessgeraet.offsetLines" v-model:hz31_5="selectedMessgeraet.hz31_5"
        v-model:hz63="selectedMessgeraet.hz63" v-model:hz125="selectedMessgeraet.hz125"
        v-model:hz250="selectedMessgeraet.hz250" v-model:hz500="selectedMessgeraet.hz500"
        v-model:hz1000="selectedMessgeraet.hz1000" v-model:hz2000="selectedMessgeraet.hz2000"
        v-model:hz4000="selectedMessgeraet.hz4000" v-model:hz8000="selectedMessgeraet.hz8000" />
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
