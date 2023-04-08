<template>
  <q-page padding>
    <!-- content -->
    <forms-edit-karte />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FormsEditKarte from 'src/components/FormsEditKarte.vue'
export default defineComponent({
  components: {
    FormsEditKarte
  }
  // name: 'PageName'
})
</script>
