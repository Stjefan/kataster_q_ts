<template>
  <div>Neuen Bericht erstellen</div>
  <div class="row justify-evenly">
    <q-btn label="Bericht erstellen" />
    <q-select v-model="selectedVorlage" :options="vorlagen" option-label="name" label="Vorlage" class="col-3" />
  </div>
  <div>Vorhandene Berichte</div>
  <q-select v-model="selectedBericht" :options="berichte" option-label="name" label="Berichte" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useKatasterStore } from '../stores/kataster-store'



export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useKatasterStore()

    const vorlagen = computed(() => store.vorlagen)
    const selectedVorlage = ref(null)

    const berichte = ref([{ 'name': 'X' }])
    const selectedBericht = ref(null)

    return {
      selectedVorlage,
      vorlagen,
      selectedBericht,
      berichte
    }
  }
})
</script>
