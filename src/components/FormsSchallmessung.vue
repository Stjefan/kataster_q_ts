<template>
  <FormKit type="button" @click="fillWithRandom" label="random" />
  <FormKit type="form" name="messung" @submit="handleSubmit" v-model="form">
    <FormKit type="date" name="messdatum" label="Datum der Messung" />
    <FormKit type="text" name="messverfahren" :disabled="true" label="Messverfahren" />
    <q-select name="messgeraet" label="Messgerät" :options="messgeraete" v-model="messgeraet" option-label="name" />
    <FormKit type="button" label="Übertragen" />
    <q-select name="overview" label="Overview-Datei" :options="overviews" v-model="overview" option-label="filename" />
    <FormKit type="button" label="Übertragen" />
    <FormKit type="button" label="Einlesen" />
    <FormKit type="list" name="messpositionen">
      <div class="row" v-for="mp in messpositionenItems" :key="mp">
        <forms-messposition-schallmessung />
      </div>
    </FormKit>
    <div class="row">
      <FormKit type="group" name="geometrieMessung">
        <FormKit type="number" label="geoXY" name="geoxy" :plugins="[castNumber]" />
        <FormKit type="number" label="geoH" name="geoh" :plugins="[castNumber]" />
        <FormKit type="number" label="geoKOmega" name="geokomega" :plugins="[castNumber]" />
        <FormKit type="number" label="k2a" name="k2a" :plugins="[castNumber]" />
      </FormKit>
    </div>
    <div class="row">
      <FormKit type="group" name="geometrieEmittent">
        <FormKit type="number" label="geo1" name="geo1" :plugins="[castNumber]" />
        <FormKit type="number" label="geo2" name="geo2" :plugins="[castNumber]" />
        <FormKit type="number" label="geo3" name="geo3" :plugins="[castNumber]" />
        <FormKit type="number" label="geo4" name="geo4" :plugins="[castNumber]" />
      </FormKit>
    </div>


  </FormKit>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import FormsMesspositionSchallmessung from './FormsMesspositionSchallmessung.vue'
import { useKatasterStore } from 'src/stores/kataster-store'
import { berechneAnlagenpegel, berechneLwlin, berechneMessflaechenkorrektur, berechneMittelungspegel, transformZ2A } from 'src/models/berechnung'
import { auswertungFactory, ein_punkt_messverfahren, MesspunktAnAnlage, messungFactory, Pegelreihe } from 'src/models/v1'
import { castNumber } from 'src/utility/errorHandling'
import { mapper } from 'src/mappings/mapper'
import { MesswertereiheForm } from 'src/models/forms'
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

    const form = ref({ messverfahren: ein_punkt_messverfahren[0], messdatum: '2023-05-23' } as any)

    function fillWithRandom() {
      form.value = {
        ...form.value, geometrieMessung: {
          geoh: 2,
          geokomega: 3,
          geoxy: 1,
          k2a: 4
        }, geometrieEmittent: {
          geo1:
            1,
          geo2: 2,
          geo3: 3,
          geo4: 4
        }
      }
    }
    async function handleSubmit(args: any) {
      console.log(args)
      const messung = await messungFactory.build({ type: '1P', messverfahren: ein_punkt_messverfahren[0] })
      console.log(messung)
      console.log(args.messpositionen[0].messwertereihen)
      // console.log(mapper.mapArray<MesswertereiheForm, Pegelreihe>(args.messpositionen[0].messwertereihen, 'MesswertereiheForm', 'Pegelreihe', { extraArgs: () => ({ target: 'gesamt' }) }))
      // console.log(mapper.mapArray<MesswertereiheForm, Pegelreihe>(args.messpositionen[0].messwertereihen, 'MesswertereiheForm', 'Pegelreihe', { extraArgs: () => ({ target: 'fremd' }) }))
      const mappedMesswerte = mapper.mapArray<MesswertereiheForm, MesspunktAnAnlage>(args.messpositionen[0].messwertereihen, 'MesswertereiheForm', 'MesspunktAnAnlage')
      console.log('MesspunktAnAnlage',)


      if (messung != null) {
        messung.messpositionen[0].messwertereihen = mappedMesswerte


        const korrektur = berechneMessflaechenkorrektur(args.geometrieEmittent, args.geometrieMessung, args.messverfahren)
        const auswertung = auswertungFactory.build()
        const anlagenpegel_alle_messpositionen = []
        const mittelungspegel_gesamt_alle_messpositionen = []
        const mittelungspegel_fremd_alle_messpositionen = []

        console.log('korrektur', korrektur)

        for (let i = 0; i < messung.messpositionen.length; i++) {
          const m = messung.messpositionen[i]

          const m_quer = berechneMittelungspegel(m)
          console.log('m_quer', m_quer)
          const a = berechneAnlagenpegel(m, korrektur.korrekturen[i])
          a.korrektur = korrektur.korrekturen[i]
          anlagenpegel_alle_messpositionen.push(a)
          mittelungspegel_gesamt_alle_messpositionen.push(m_quer.gesamtpegel)
          if (m_quer.fremdpegel != null) {
            mittelungspegel_fremd_alle_messpositionen.push(m_quer.fremdpegel)
          }


        }


        console.log('gesamtanlagenpegel', anlagenpegel_alle_messpositionen)

        const lwlin = berechneLwlin(anlagenpegel_alle_messpositionen)
        console.log('lwlin', lwlin)
        const lwa = transformZ2A(lwlin)
        console.log('lwa', lwa)

        auswertung.mittelungspegel_gesamt = mittelungspegel_gesamt_alle_messpositionen
        auswertung.mittelungspegel_fremd = mittelungspegel_fremd_alle_messpositionen
        auswertung.anlagenpegel = anlagenpegel_alle_messpositionen
        auswertung.lwlin = lwlin
        auswertung.lwa = lwa

        messung.auswertung = auswertung
        args.auswertung = auswertung

      }

      console.log('Ergebnis', args)

    }



    const messpositionenItems = computed(() => {
      switch (messungsTyp.value) {
        case '1P':
          return [1]
        case '3P':
          return [1, 2, 3]
        case '4P':
          return [1, 2, 3, 4]
        case '5P':
          return [1, 2, 3, 4, 5]
        default:
          return [1]

      }
    })


    const messungsTyp = ref('1P')

    return {
      messpositionenItems,
      handleSubmit,
      fremdpegelVorhanden,
      messgeraete,
      messgeraet,
      overviews,
      overview,
      form,
      fillWithRandom,
      castNumber
    }
  }
})
</script>
