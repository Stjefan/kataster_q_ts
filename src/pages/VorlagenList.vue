<template>
  <q-page padding>
    <!-- content -->
    <q-btn label="Neue Vorlage hinzufügen" @click="create" />
    <q-btn label="Änderungen speichern" @click="saveChanges" />
    <q-select v-model="selectedVorlage" :options="vorlagen" option-label="name" />
    <div v-if="selectedVorlage">
      <vorlage-details v-model:name="selectedVorlage.name" />
      <div v-for="f in fields" :key="f" class="row">

        <q-input :model-value="f" dense />
        <q-input :model-value="f" dense />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Vorlage, vorlageFactory } from 'src/models/v1'
import VorlageDetails from 'src/components/VorlageDetails.vue'
import { useKatasterStore } from '../stores/kataster-store'

export default defineComponent({
  components: { VorlageDetails },
  // name: 'PageName'
  setup() {
    const store = useKatasterStore()
    const fields = Array.from([...Array(36).keys()])
    const vorlagen = computed(() => store.vorlagen)
    const selectedVorlage = ref(null as Vorlage | null)
    return {
      create() {

        store.createExcelTemplateBackend(vorlageFactory.build())


      },
      saveChanges() {
        if (selectedVorlage.value != null) {
          store.updateExcelTemplateBackend(selectedVorlage.value)
        }
      },
      selectedVorlage,
      vorlagen,
      fields
    }
  }
})
</script>
