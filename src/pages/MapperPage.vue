<template>
  <q-page padding>
    <!-- content -->
    HELLLLO
    <div>{{ x }}</div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  // name: 'PageName'
  setup() {
    const x = ref(10)

    function foo() {
      console.log('foo')

    }
    return {
      x,
      foo

    }

  }
})
</script>
