<template>
  <FormKit type="step" name="stepOne">
    <FormKit type="text" label="Name" validation="required" />
    <FormKit type="checkbox" label="Ignore Step 2" v-model="ignoreStep2" />
  </FormKit>
  <FormKit type="step" name="stepTwo" v-if="!ignoreStep2">
    <FormKit type="textarea" label="Your story" validation="required" />
  </FormKit>
  <FormKit type="step" name="stepThree">
    <FormKit type="textarea" label="Something else" />
  </FormKit>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const ignoreStep2 = ref(false)
    return {
      ignoreStep2
    }
  }
})
</script>
