<template>
  <q-input label="Bezeichnung" :model-value="name" @update:model-value="$emit('update:name', $event)" />
  <q-btn label="Vorlage löschen" @click="$emit('remove')" />
  <q-btn label="Änderungen speichern" @click="$emit('save')" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  props: ['name'],

})
</script>
