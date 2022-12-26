<template>
  <q-input label="Bezeichnung" :model-value="name" @update:model-value="$emit('update:name', $event)" />
  <q-btn label="Projekt löschen" @click="$emit('remove')" />
  <q-btn label="Änderungen speichern" @click="$emit('save')" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  props: ['name'],
  setup() {
    // const name = ref('blabla')
    return {}
  }
})
</script>
