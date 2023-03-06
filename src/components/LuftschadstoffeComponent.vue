<template>
  <!--
  <FormKit type="form" @submit="sub" name="dataMessungen" label="Messung">


    <FormKit type="list" v-model="valuesMessungen" name="messungen">

      <FormKit v-for="key in itemsMessungen" :key="key" :id="key" type="group" label="Group">
        <FormKit name="id" />
        <FormKit label="Grenzwert" name="grenzwert" />
        <FormKit label="Gemessener Abluftvolumenstrom" name="abluftvolumenstrom_gemessen" type="number" />
        <FormKit label="Genehmigter Abluftvolumenstrom" name="abluftvolumenstrom_genehmigt" type="number" />
        <FormKit label="Austrtrittsfläche" name="austrittsflaeche" type="number" />
        <FormKit label="Abluftkonzentration" name="abluftkonzentration" type="number" />
        <FormKit label="Austrittsgeschwindigkeit" name="austrittsgeschwindigkeit" type="number" />
        <FormKit label="Ableitbedingungen erfüllt" name="ableitbedingungen_fulfilled" type="checkbox" />
        <FormKit label="Geruchsrelevanz" name="geruchsrelevanz" type="checkbox" />
        <FormKit label="Files" name="file" type="file" multiple />
        <FormKit label="Messdatum" name="messdatum" type="date" />
        <FormKit label="Bemerkung" name="bemerkung" type="text" />
        <button class="formkit-remove" :data-key="key" href="#" @click="removeItemMessung">-</button>
      </FormKit>
    </FormKit>
    <br />
    <button type="button" @click.prevent="addItemMessung">Messung hinzufügen</button>

  </FormKit>
  <q-btn label="Save LuftschadstoffMessung" @click="saveLuftschadstoffMessung" />
-->
  <!--


  <FormKit type="form" @submit="sub" name="data">
    <FormKit type="list" v-model="values" name="genehmigungen">

      <FormKit v-for="key in items" :key="key" :id="key" type="group" label="Group">
        <FormKit label="Aktenzeichen" name="aktenzeichen" />
        <FormKit label="Bezeichnung" name="name" type="text" />
        <FormKit label="pdf" name="file" type="file" multiple />
        <FormKit label="gültig bis" name="gueltig_bis" type="date" />
        <button class="formkit-remove" :data-key="key" href="#" @click="removeItem">-</button>
      </FormKit>
    </FormKit>
    <br />
    <button type="button" @click.prevent="addItem">Genehmigung hinzufügen</button>
  </FormKit>
  -->
  <!--
  <pre wrap>{{ values }}</pre>
  <pre wrap>{{ items }}</pre>
  -->
  <h6>Genehmigungen</h6>
  <q-select v-model="selectedGenehmigung" :options="luftschadstoffe.genehmigungen" option-label="name" />
  <q-btn label="Genehmigung hinzufügen" @click="addGenehmigung" />
  <q-btn label="Genehmigung löschen" @click="deleteGenehmigung" />
  <FormKit type="form" @submit="sub" name="genehmigung" label="Genehmigung" v-model="selectedGenehmigung"
    v-if="selectedGenehmigung">
    <FormKit label="Aktenzeichen" name="aktenzeichen" />
    <FormKit label="Bezeichnung" name="name" type="text" />
    <FormKit label="pdf" name="file" type="file" multiple />
    <FormKit label="gültig bis" name="gueltig_bis" type="date" />
  </FormKit>
  <h6>Luftschadstoffmessungen</h6>
  <q-select v-model="selectedMessung" :options="luftschadstoffe.messungen" option-label="bemerkung" />

  <q-btn label="Luftschadstoffmessung hinzufügen" @click="addMessung" />
  <q-btn label="Luftschadstoffmessung löschen" @click="deleteMessung" />
  <FormKit type="form" @submit="submitSingleMessung" name="dataMessungen" label="Messung" v-model="selectedMessung"
    v-if="selectedMessung">
    <FormKit name="id" hidden />
    <FormKit label="Grenzwert" name="grenzwert" />
    <FormKit label="Gemessener Abluftvolumenstrom" name="abluftvolumenstrom_gemessen" type="number" />
    <FormKit label="Genehmigter Abluftvolumenstrom" name="abluftvolumenstrom_genehmigt" type="number" />
    <FormKit label="Austrtrittsfläche" name="austrittsflaeche" type="number" />
    <FormKit label="Abluftkonzentration" name="abluftkonzentration" type="number" />
    <FormKit label="Austrittsgeschwindigkeit" name="austrittsgeschwindigkeit" type="number" />
    <FormKit label="Ableitbedingungen erfüllt" name="ableitbedingungen_fulfilled" type="checkbox" />
    <FormKit label="Geruchsrelevanz" name="geruchsrelevanz" type="checkbox" />
    <FormKit label="Files" name="file" type="file" multiple />
    <FormKit label="Messdatum" name="messdatum" type="date" />
    <FormKit label="Bemerkung" name="bemerkung" type="text" />
  </FormKit>
  <!--
  <q-select v-model="selectedMessung" :options="luftschadstoffe.messungen" option-label="bemerkung" />

  <div v-if="selectedMessung">
    <q-input v-model="selectedMessung.grenzwert" type="number" label="Grenzwert" />
    <q-input v-model="selectedMessung.gemessenerAbluftvolumenstrom" label="Gemessener Abluftvolumenstrom" />
    <q-input v-model="selectedMessung.genehmigterAbluftvolumenstrom" label="Genehmigter Abluftvolumenstrom" />
    <q-input v-model="selectedMessung.austrittsfläche" label="Austrittsfläche" />
    <q-checkbox v-model="selectedMessung.ableitbedingungenErfüllt" label="Ableitbedingungen erfüllt" />
    <q-checkbox v-model="selectedMessung.geruchsrelevanz" label="Geruchsrelevant" />
    <q-input v-model="selectedMessung.abluftkonzentration" label="Abluftkonzentration [m^3]" />
    <q-input v-model="selectedMessung.austrittsgeschwindigkeitAbluft" type="number" label="Austrittsgeschwindigkeit" />
    <q-input v-model="selectedMessung.bemerkung" label="Bemerkung" />
    <q-input type="file" v-model="selectedMessung.file" label="PDFs" multiple />
  </div>
  -->
  <q-btn label="Submit all" @click="saveAll" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { luftschadstoffeFactory, genehmigungFactory, luftschaffMessungFactory, LuftschadstoffMessung, LuftschadstoffGenehmigung } from 'src/models/v1'
import { token } from '@formkit/utils'
import { useKatasterStore, } from '../stores/kataster-store'
import { uuidv4 } from 'src/models/v1'
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    function saveAll() {
      for (const curr of luftschadstoffe.value.messungen) {
        curr.id = curr.id ?? uuidv4()
      }
      for (const curr of luftschadstoffe.value.genehmigungen) {
        curr.id = curr.id ?? uuidv4()
      }

      store.saveLuftschadstoffe(luftschadstoffe.value)
    }
    const store = useKatasterStore()
    console.log('Luftschadstoffe', store.emittent!.luftschadstoffe)
    const luftschadstoffe = ref(store.emittent!.luftschadstoffe)


    const messung = ref(store.emittent!.luftschadstoffe.messungen[0])

    function addGenehmigung() {
      luftschadstoffe.value.genehmigungen.push(genehmigungFactory.build())
    }
    const selectedMessung = ref(null as LuftschadstoffMessung | null)
    const selectedGenehmigung = ref(null as LuftschadstoffGenehmigung | null)
    function addMessung() {
      luftschadstoffe.value.messungen.push(luftschaffMessungFactory.build())
    }
    function deleteMessung() {
      if (selectedMessung.value != null) {
        const idx = luftschadstoffe.value.messungen.findIndex(i => i.id == selectedMessung.value!.id)
        luftschadstoffe.value.messungen.splice(idx, 1)
        selectedMessung.value = null
      }
    }
    function deleteGenehmigung() {
      if (selectedGenehmigung.value != null) {
        const idx = luftschadstoffe.value.genehmigungen.findIndex(i => i.id == selectedGenehmigung.value!.id)
        luftschadstoffe.value.genehmigungen.splice(idx, 1)
        selectedGenehmigung.value = null
      }
    }
    const blub = ref('abc')
    const results = ref(null as any)
    function sub(args: any) {
      console.log(args)
      results.value = args
      console.log(results)
    }

    const list = ref([{ 'name': 'X' }, { 'name': 'Y' }])

    const values = ref([])

    // Iterating over this:
    const items = ref(values.value.map(i => token()).concat([token()]))

    const addItem = () => {
      items.value.push(token())
    }

    const removeItem = (e: any) => {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(items.value, key)
      console.log([...items.value])
      items.value = items.value.filter(item => item !== key)
      console.log([...items.value])
    }

    const valuesMessungen = ref([])

    // Iterating over this:
    const itemsMessungen = ref(valuesMessungen.value.map(i => token()).concat([token()]))

    const addItemMessung = () => {
      itemsMessungen.value.push(token())
    }

    const removeItemMessung = (e: any) => {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(itemsMessungen.value, key)
      console.log([...itemsMessungen.value])
      itemsMessungen.value = itemsMessungen.value.filter(item => item !== key)
      console.log([...itemsMessungen.value])
    }


    function saveLuftschadstoffMessung() {
      const curr = results.value.messungen[0]
      curr.id = uuidv4()
      console.log('saving', curr)
      store.saveLuftschadstoffMessung({ id: curr.id }, curr.file[0].file)
    }

    const allMessungen = ref([] as any[])

    function submitSingleMessung(args: any) {
      results.value = args
      console.log(results)
      const curr = results.value
      curr.id = curr.id ?? uuidv4()

      console.log('saving', curr)
      store.saveLuftschadstoffMessung(curr, curr.file[0]?.file)
    }


    return {
      messung,
      submitSingleMessung,
      saveLuftschadstoffMessung,
      valuesMessungen,
      itemsMessungen,
      addItemMessung,
      removeItemMessung,

      addItem,
      removeItem,
      items,
      values,
      blub,
      selectedMessung,
      selectedGenehmigung,
      luftschadstoffe,
      addMessung,
      addGenehmigung,
      deleteMessung,
      deleteGenehmigung,
      sub,
      list,
      saveAll

    }
  }
})
</script>
