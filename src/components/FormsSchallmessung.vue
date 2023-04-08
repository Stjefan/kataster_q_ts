<template>
  <FormKit type="group" name="messung">

    <q-select name="messgeraet" label="Messgerät" :options="messgeraete" v-model="messgeraet" option-label="name" />
    <FormKit type="button" label="Übertragen" />
    <q-select name="overview" label="Overview-Datei" :options="overviews" v-model="overview" option-label="name" />
    <FormKit type="button" label="Übertragen" />
    <FormKit type="button" label="Einlesen" />
    <FormKit type="list" name="messpositionen">
      <div class="row" v-for="mp in messpositionenItems" :key="mp">
        {{ mp }}
        <forms-messposition-schallmessung />
      </div>
    </FormKit>
    <div class="row">
      <FormKit type="group" name="geometrieMessung">
        <FormKit type="number" label="geoXY" name="geoXY" />
        <FormKit type="number" label="geoH" name="geoH" />
        <FormKit type="number" label="geoKOmega" name="geoKOmega" />
        <FormKit type="number" label="k2a" name="k2a" />
      </FormKit>
    </div>
    <div class="row">
      <FormKit type="group" name="geometrieEmittent">
        <FormKit type="number" label="geo1" name="geo1" />
        <FormKit type="number" label="geo2" name="geo2" />
        <FormKit type="number" label="geo3" name="geo3" />
        <FormKit type="number" label="geo4" name="geo4" />
      </FormKit>
    </div>
    <FormKit type="button" @click="messungAuswerten" label="Messung auswerten" />
    <FormKit type="button" label="Zeige Auswertung" />


  </FormKit>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import FormsMesspositionSchallmessung from './FormsMesspositionSchallmessung.vue'
import { useKatasterStore } from 'src/stores/kataster-store'
export default defineComponent({
  components: { FormsMesspositionSchallmessung },
  // name: 'ComponentName'
  setup() {

    const store = useKatasterStore()

    const messgeraete = computed(() => store.messgeraete)
    const messgeraet = ref(null as any)

    const overviews = computed(() => store.overviews)
    const overview = ref(null as any)

    const fremdpegelVorhanden = ref(false)
    function handleSubmit(args: any) {
      console.log(args)
    }



    const messpositionenItems = ref([1, 2])

    function messungAuswerten() {
      console.log('messungAuswerten')
    }
    return {
      messpositionenItems,
      handleSubmit,
      fremdpegelVorhanden,
      messgeraete,
      messgeraet,
      overviews,
      overview,
      messungAuswerten
    }
  }
})
</script>
