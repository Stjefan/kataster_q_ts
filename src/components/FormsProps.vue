<template>
  <div>My component</div>
  {{ bla }}
  <FormKit type="form" @submit="handleSubmit">
    <FormKit type="text" :value="bla" label="PropVal" />
  </FormKit>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  props:
  {
    'bla': {
      type: String
    }
  },
  setup() {
    function handleSubmit(args: any) {
      console.log(args)

    }
    return {
      handleSubmit
    }
  }
})
</script>
