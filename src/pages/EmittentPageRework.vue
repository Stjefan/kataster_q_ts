<template>
  <q-page padding>
    <!-- content -->
    Informationen zu Emittent XY


    <q-tabs v-model="tab">
      <q-tab name="allgemeines" label="Allgemeines" />
      <q-tab name="schallmessung" label="Schallmessung" />
      <q-tab name="schadstoffmessung" label="Schadstoffmessung" />

    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="allgemeines">

        <forms-props v-for="el in blas" :key="el" :bla="el" />
        <q-btn label="+" @click="add2blas" />
        <forms-emittent-details />
      </q-tab-panel>
      <q-tab-panel name="schallmessung">
        <q-stepper v-model="step" ref="stepper" color="primary" animated header-nav>
          <q-step :name="1" title="Messung" icon="settings">
            <forms-schallmessung />
          </q-step>

          <q-step :name="2" title="Auswertung" caption="Optional" icon="create_new_folder">
            <forms-auswertung />
          </q-step>
          <q-step :name="3" title="Bericht" caption="Optional" icon="create_new_folder">
            <forms-xlsx-report />
          </q-step>
        </q-stepper>

      </q-tab-panel>
      <q-tab-panel name="schadstoffmessung">
        <forms-schadstoffmessung />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
import FormsEmittentDetails from 'src/components/FormsEmittentDetails.vue'
import FormsSchadstoffmessung from 'src/components/FormsSchadstoffmessung.vue'
import FormsSchallmessung from 'src/components/FormsSchallmessung.vue'
import FormsAuswertung from 'src/components/FormsAuswertung.vue'
import FormsXlsxReport from 'src/components/FormsXlsxReport.vue'

import { defineComponent, ref } from 'vue'
import FormsProps from 'src/components/FormsProps.vue'
export default defineComponent({
  components: { FormsEmittentDetails, FormsSchadstoffmessung, FormsSchallmessung, FormsAuswertung, FormsXlsxReport, FormsProps },
  // name: 'PageName'
  setup() {
    function handleSubmit(args: any) {
      console.log(args)
    }
    const tab = ref('allgemeines')
    const step = ref(1)
    const blas = ref(['a', 'b'])
    function add2blas() {
      blas.value.push('c')
    }
    return {
      handleSubmit, tab, step, blas, add2blas
    }
  }
})
</script>
