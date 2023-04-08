<template>
  <q-page padding>
    <!-- content -->
    <forms-edit-karte />
    <forms-emittent-details />
    <forms-messgeraet />
    <forms-overview />
    <forms-search />
    <forms-vorlage />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FormsEditKarte from 'src/components/FormsEditKarte.vue'
import FormsEmittentDetails from 'src/components/FormsEmittentDetails.vue'
import { api } from '../boot/axios'
import FormsMessgeraet from 'src/components/FormsMessgeraet.vue'

import FormsOverview from 'src/components/FormsOverview.vue'

import FormsSearch from 'src/components/FormsSearch.vue'
import FormsVorlage from 'src/components/FormsVorlage.vue'
export default defineComponent({
  // name: 'PageName'
  components: { FormsEditKarte, FormsEmittentDetails, FormsMessgeraet, FormsOverview, FormsSearch, FormsVorlage },

  setup() {
    return {

    }

  }
})
</script>
