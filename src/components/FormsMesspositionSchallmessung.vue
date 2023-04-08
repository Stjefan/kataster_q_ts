<template>
  <FormKit type="group" name="messposition">

    <FormKit type="list" v-model="values" name="messwertereihen">

      <FormKit v-for="key in items" :key="key.id" type="group" label="Group">
        <FormKit type="group" name="gesamtpegel">
          <table>
            <tr>
              <td>
                <FormKit type="number" name="hz31_5" label="31.5 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz63" label="63 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz125" label="125 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz250" label="250 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz500" label="500 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz1000" label="1000 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz2000" label="2000 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz4000" label="4000 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz8000" label="8000 Hz" />
              </td>
            </tr>
            <tr>
              <td>
                <FormKit type="select" name="messgeraet" label="Messgerät" :options="optionsMessgeraete"
                  placeholder="Select a country" />
              </td>
              <td>
                <FormKit type="select" name="overview" label="Overview-Datei" :options="optionsOverviews"
                  placeholder="Select a country" />
              </td>
              <td>
                <FormKit type="text" name="messfile" label="Messfile" />
              </td>
            </tr>
            <tr>
              <td>
                <FormKit type="button" label="Einlesen" />
              </td>
              <td>
                <FormKit type="button" label="Paste" />
              </td>
            </tr>
            <tr>
              <td>
                <FormKit name="fremdpegelVorhanden" type="checkbox" validation="required"
                  v-model="key.fremdpegelVorhanden" label="Fremdpegel vorhanden" />
              </td>
              <td>
                <FormKit type="button" label="-" @click="removeItem" :data-key="key.id" />
              </td>
            </tr>



          </table>
        </FormKit>


        <FormKit type="group" name="fremdpegel" v-if="key.fremdpegelVorhanden" label="Fremdpegel">
          <table>
            <tr>
              <td>
                <FormKit type="number" name="hz31_5" label="31.5 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz63" label="63 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz125" label="125 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz250" label="250 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz500" label="500 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz1000" label="1000 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz2000" label="2000 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz4000" label="4000 Hz" />
              </td>
              <td>
                <FormKit type="number" name="hz8000" label="8000 Hz" />
              </td>
            </tr>
            <tr>
              <td>
                <FormKit type="select" name="messgeraet" label="Messgerät" />
              </td>
              <td>
                <FormKit type="select" name="overview" label="Overview-Datei" />
              </td>
              <td>
                <FormKit type="text" name="messfile" label="Messfile" />
              </td>
            </tr>
            <tr>
              <td>
                <FormKit type="button" label="Einlesen" />
              </td>
              <td>
                <FormKit type="button" label="Paste" />
              </td>
            </tr>



          </table>
        </FormKit>

      </FormKit>
    </FormKit>
    <br />

    <FormKit type="button" label="Messreihe hinzufügen" @click="addItem" />

  </FormKit>
</template>

<script lang="ts">
import { uuidv4 } from 'src/models/v1'
import { computed, defineComponent, ref } from 'vue'
import { useKatasterStore } from 'src/stores/kataster-store'
export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useKatasterStore()
    console.log(store.overviews)

    const optionsOverviews = computed(() => {
      return store.overviews.map(i => ({ label: i.filename, value: i.id }))
    })

    const optionsMessgeraete = computed(() => {
      return store.messgeraete.map(i => ({ label: i.name, value: i.id }))
    })

    const values = ref([])
    const items = ref([{ id: uuidv4(), fremdpegelVorhanden: false }])
    const fremdpegelVorhanden = ref(false)
    function handleSubmit(args: any) {
      console.log(args)
    }
    const addItem = () => {
      items.value.push({ id: uuidv4(), fremdpegelVorhanden: false })
    }

    const removeItem = (e: any) => {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(items.value, key)
      console.log([...items.value])
      items.value = items.value.filter(item => item.id !== key)
      console.log([...items.value])
    }

    return {
      addItem,
      removeItem,
      handleSubmit,
      fremdpegelVorhanden,
      items,
      values,
      optionsOverviews,
      optionsMessgeraete
    }
  }
})
</script>
