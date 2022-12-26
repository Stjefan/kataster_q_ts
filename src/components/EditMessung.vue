<template>
  <div>My component</div>y
  <q-input :model-value="datum" @update:model-value="$emit('update:datum', $event)" />
  <q-input :model-value="blabla" @update:model-value="$emit('update:blabla', $event)" type="number" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  props: ['datum', 'blabla']

})
</script>
