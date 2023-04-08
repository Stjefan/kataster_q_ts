<template>
  <p>
    {{ values }}
  </p>
  <p>
    {{ rows }}
  </p>
  <FormKit type="group" name="messposition">
    <FormKit type="list" v-model="values" name="messwertereihen">
      <q-table :rows="rows">
        <template v-slot:top>
          <q-btn label="Messreihe hinzufügen" @click="addItem" />
          <q-btn label="Random" @click="readDocs" />
        </template>
        <template v-slot:header>
          <q-th>Fremdpegel vorhanden?</q-th>
          <q-th>31.5 Hz</q-th>
          <q-th>63 Hz</q-th>
          <q-th>125 Hz</q-th>
          <q-th>250 Hz</q-th>
          <q-th>500 Hz</q-th>
          <q-th>1000 Hz</q-th>
          <q-th>2000 Hz</q-th>
          <q-th>4000 Hz</q-th>
          <q-th>8000 Hz</q-th>
          <q-th>Messgerät</q-th>
          <q-th>Overview</q-th>
          <q-th>Messfile</q-th>
          <q-th></q-th>
          <q-th />
          <q-th />
        </template>
        <template v-slot:body="props">
          <q-tr>
            <FormKit type="group" name="row">
              <q-td>
                <FormKit name="id" type="text" />
                <FormKit name="fremdpegelVorhanden" type="checkbox" v-model="props.row.fremdpegelVorhanden" />

              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz31_5" type="number" :step="stepsize" validation="required"
                  :plugins="[castNumber]" />
                <FormKit name="fremdpegel__hz31_5" type="number" :step="stepsize" v-if="props.row.fremdpegelVorhanden"
                  validation="required" :plugins="[castNumber]" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz63" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz63" type="number" :step="stepsize" v-if="props.row.fremdpegelVorhanden"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz125" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz125" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz250" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz250" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz500" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required, number" />
                <FormKit name="fremdpegel__hz500" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required|number" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz1000" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz1000" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz2000" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz2000" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz4000" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz4000" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__hz8000" type="number" :step="stepsize" :plugins="[castNumber]"
                  validation="required" />
                <FormKit name="fremdpegel__hz8000" type="number" v-if="props.row.fremdpegelVorhanden" :step="stepsize"
                  :plugins="[castNumber]" validation="required" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__messgeraet" type="select" :options="messgeraete" />
                <FormKit name="fremdpegel__messgeraet" type="select" v-if="props.row.fremdpegelVorhanden"
                  :options="messgeraete" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__overview" type="select" :options="overviews" />
                <FormKit name="fremdpegel__overview" type="select" v-if="props.row.fremdpegelVorhanden"
                  :options="overviews" />
              </q-td>
              <q-td>
                <FormKit name="gesamtpegel__messfile" type="text" />
                <FormKit name="fremdpegel__messfile" type="text" v-if="props.row.fremdpegelVorhanden" />
              </q-td>
              <q-td>
                <FormKit type="button" label="-" :data-key="props.row.id" @click="removeItem" />
              </q-td>
              <q-td>
                <FormKit type="button" label="Einlesen" />
              </q-td>
              <q-td>
                <FormKit type="button" label="Paste" />
              </q-td>
            </FormKit>
          </q-tr>
        </template>
      </q-table>
    </FormKit>
  </FormKit>
</template>

<script lang="ts">
import { getNode } from '@formkit/core'
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'
import { computed, defineComponent, ref } from 'vue'
import { getRandomNumber } from 'src/utility/errorHandling'
import { castNumber } from 'src/utility/errorHandling'

export default defineComponent({
  components: {},
  // name: 'PageName'
  setup() {
    const stepsize = ref(0.1)
    const store = useKatasterStore()

    const messgeraete = computed(() => [{ label: '', value: null as string | null }].concat(store.messgeraete.map(i => ({ label: i.name, value: i.id }))))
    const messgeraet = ref(null as any)

    const overviews = computed(() => [{ label: '', value: null as string | null }].concat(store.overviews.map(i => ({ label: i.filename, value: i.id }))))
    const overview = ref(null as any)





    const cols = [{ label: 'ID', field: 'id', name: 'col1' }, { label: 'Nowhere', name: 'col2', field: 'name' }, { label: 'Nowhere', name: 'col3', }]

    function submitHandler(args: any) {
      console.log(args)

    }

    async function addItem() {
      const i = { id: uuidv4(), 'gesamtpegel__hz63': 1 }

      values.value.push(i)
      const ii = { id: i.id, fremdpegelVorhanden: false }
      rows.value.push(ii)

      // const node1 = getNode('form-messungen');
      //console.log('node1', node1)
      //console.log(getNode('blabla'))
      //await node1?.isSettled;

      //items.value.push(val.id)
    }

    function removeItem(e: any) {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(rows.value, key, values.value)
      // rows.value = []

      const idx = values.value.findIndex(item => item.id == key)
      values.value = values.value.filter((item: any, idx: number) => item.id != key)
      console.log(idx, values.value.length)

      //rows.value = rows.value.filter(item => item.id != key)
      rows.value = rows.value.filter(item => item.id != key)
      console.log(rows.value)
    }


    const items = ref([])

    const values = ref([{ id: uuidv4(), 'gesamtpegel__hz31_5': 32.3, 'gesamtpegel__hz63': 12.456 }, { id: uuidv4(), 'gesamtpegel__hz63': 54 }, { id: uuidv4(), 'gesamtpegel__hz63': 94 }])
    const rows = ref(values.value.map(i => ({ id: i.id, fremdpegelVorhanden: false })))

    console.log('rows', rows)

    function readDocs() {
      values.value = []
      const arrOfFrequenzen = [
        'hz31_5',
        'hz63',
        'hz125',
        'hz250',
        'hz500',
        'hz1000',
        'hz2000',
        'hz4000',
        'hz8000',
      ];
      const funArr = [{ id: uuidv4() }, { id: uuidv4() }] as any[]

      for (let f of funArr) {
        const hasFremdpegel = getRandomNumber() > 50
        f['fremdpegelVorhanden'] = hasFremdpegel
        for (let i of arrOfFrequenzen) {
          f[`gesamtpegel__${i}`] = getRandomNumber()
          if (hasFremdpegel) {
            f[`fremdpegel__${i}`] = getRandomNumber()

          }
        }
      }
      // rows.value = [fun]
      rows.value = funArr.map(i => ({ id: i.id, fremdpegelVorhanden: false }))
      values.value = funArr
    }

    return {
      readDocs,
      values,
      submitHandler,
      rows,
      cols,
      addItem,
      removeItem,
      messgeraete,
      overviews,
      stepsize,
      castNumber
    }






  }
})
</script>
