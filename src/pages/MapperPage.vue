<template>
  <q-page padding>
    <!-- content -->

  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'
import { mapper } from 'src/mappings/mapper'
import { Emittent, Roof, buildingFactory, Building, EmittentDetails, emittentDetailsFactory, KarteDetails, Plant, plantFactory, roofFactory, emittentFactory, karteDetailsFactory, metainfoFactory, messwertereiheFactory, projectFactory, Projekt } from 'src/models/v1'
import { Building as BuildingApi, EmittentDetail, KarteApi, Werk, Roof as RoofApi, Emittent as EmittentApi, Project as ProjectApi } from 'src/models/api'
import { AxiosError } from 'axios'
import { errorHandler } from 'src/utility/errorHandling'

export default defineComponent({
  // name: 'PageName'
  setup() {
    return {}
  }
})
</script>
