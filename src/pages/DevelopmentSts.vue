<template>
  <q-page padding>
    <!-- content -->
    ??
    <suspense>
      <default-messung />
    </suspense>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DefaultMessung from '../components/DefaultMessung.vue'
export default defineComponent({
  // name: 'PageName'
  components: { DefaultMessung }
})
</script>
