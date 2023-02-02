<template>
  <q-page padding>
    <!-- content -->
    <q-tabs v-model="tab">
      <q-tab name="allgemeines" label="Allgemeines" />
      <q-tab name="schallmessung" label="Schallmessung" :disable="selectedMessung.length == 0" />
      <q-tab name="sonstiges" label="Sonstiges" />
      <q-tab label="Archiv" @click="openArchive" />
      <q-tab label="Archivieren" @click="makeSnapshot" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="schallmessung">
        <suspense>
          <default-messung />
        </suspense>
      </q-tab-panel>
      <q-tab-panel name="sonstiges"></q-tab-panel>
      <q-tab-panel name="allgemeines">
        <div class="row">
          <q-btn @click="handleUndo" icon="undo" />
          <q-btn @click="redo" icon="redo" />

          <q-btn label="Änderungen speichern" @click="saveChanges" />
        </div>
        <div class="row">
          <div class="col-6 q-pa-md">
            <div v-if="emittent">
              <q-input v-model="emittent.name" label="Name" name="name" />
              <q-input v-model="emittent.bearbeiter" label="Bearbeiter" />
              <div class="row">
                <q-input v-model="emittent.kostenstelle" label="Kostenstelle" />
                <q-input label="Abteilung" v-model="emittent.abteilung" />
              </div>
              <q-input label="Messinstitut" v-model="emittent.messinstitut" />
              <q-input label="Anlage" v-model="emittent.anlage" />
              <div v-if="false">
                <q-input label="Erstellt:" :model-value="emittent.created" :disable="true" />
                <q-input label="Letzte Änderung:" :model-value="emittent.modified" :disable="true" />
              </div>

              <div class="row">
                <q-input label="Höhe" type="number" v-model="emittent.hoehe" class="col-3" />
                <q-input label="GK-Rechts" type="number" v-model="emittent.gkrechts" class="col-3" />
                <q-input label="GK-Hoch" type="number" v-model="emittent.gkhoch" class="col-3" />

              </div>

              <!--<q-input label="Letzte Messung" type="date" />-->
              <q-input label="Bemerkung" v-model="emittent.bemerkung" />
              <q-checkbox label="In Betrieb" v-model="emittent.in_betrieb" />
              <q-checkbox label="Zur Messung vormerken" v-model="emittent.fuer_messung_vormerken" />
              <q-checkbox label="Liegt an Fassade" v-model="emittent.liegt_an_fassade" />
            </div>
          </div>
          <div class="col-6 q-pa-md">
            <q-btn label="Zeige hochgeladenes Bild" @click="showPicture" />
            <q-btn label="Bild entfernen" @click="removePicture" />
            <q-input type="file" v-model="fileupload" />
            <img :src="emittent.picture" style="max-width: 45vw; max-height: 45vh" />
          </div>
        </div>

        <q-btn label="Neue Messung anlegen" @click="createMessung" />
        <q-table :rows="emittent.messungen" v-model:selected="selectedMessung" selection="single" :columns="cols">
          <template v-slot:body-cell-removeMessung="props">
            <q-td>
              <q-btn label="Entfernen" @click="removeMessung(props.row.id)" />
            </q-td>
          </template>
        </q-table>
        <div v-if="store.developmentMode">
          {{ selectedMessung }}
        </div>

      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">

import { defineComponent, Ref, ref, watch } from 'vue'

import DefaultMessung from '../components/DefaultMessung.vue'
import { Messung, messungFactory, emittentDetailsFactory, verfuegbareMessverfahren, kamin_messverfahren, ein_punkt_messverfahren, vier_punkt_messverfahren, fuenf_punkt_messverfahren } from '../models/v1'

import { useRefHistory } from '@vueuse/core'
import { useQuasar } from 'quasar';
import EmittentArchiv from 'src/components/EmittentArchiv.vue';
import * as _ from 'lodash'
import { useKatasterStore } from 'src/stores/kataster-store';
export default defineComponent({
  components: {
    DefaultMessung
  },
  // name: 'PageName'
  setup() {

    const $q = useQuasar();

    const store = useKatasterStore()

    if (store.emittent == null) throw new Error('Store is missing emittent')

    const emittent = ref(_.cloneDeep(store.emittent))
    const { history, undo, redo } = useRefHistory(emittent, {
      deep: true,
    })
    const tab = ref('allgemeines')

    function handleUndo() {
      console.log('before', emittent.value)
      undo()
      selectedMessung.value = []
      console.log('after', emittent.value)
    }



    const selectedMessung: Ref<Messung[]> = ref(emittent.value.messungen.length > 0 ? [emittent.value.messungen[0]] : [])

    watch(selectedMessung, val => {
      store.$patch((state) => {
        if (val.length > 0) {
          state.messung2edit = val[0]
        } else {
          state.messung2edit = null
        }
      }
      )
    }, { immediate: true })

    function createMessung() {
      $q.dialog({
        title: 'Neue Messung anlegen',
        message: 'Angewandtes Messverfahren wählen:',
        cancel: true,
        persistent: true,
        options: {
          model: 'opt1',
          // inline: true
          items: verfuegbareMessverfahren.map(i => ({ label: i, value: i }))
          /*
          items: [
            { label: '1 Anlage', value: 'opt1', color: 'secondary' },
            { label: '3 Anlagen', value: 'opt3' },
            { label: '4 Anlagen', value: 'opt4' },
            { label: '5 Anlagen', value: 'opt5' }
          ]
          */
        }
      }).onOk(async (data) => {
        console.log(data);
        if (ein_punkt_messverfahren.includes(data)) {
          emittent.value.messungen.push((await messungFactory.build({ 'type': '1P' }))!)

        } else if (kamin_messverfahren.includes(data)) {
          emittent.value.messungen.push((await messungFactory.build({ 'type': '4P' }))!)

        } else if (vier_punkt_messverfahren.includes(data)) {
          emittent.value.messungen.push((await messungFactory.build({ 'type': '4P' }))!)

        } else if (fuenf_punkt_messverfahren.includes(data)) {
          emittent.value.messungen.push((await messungFactory.build({ 'type': '5P' }))!)

        }

      })

    }
    function removeMessung(args: any) {
      console.log('remove', args)
      const idx = emittent.value.messungen.findIndex(i => i.id === args)
      emittent.value.messungen.splice(idx, 1)
    }
    function showPicture() {
      console.log('')
      emittent.value.picture = URL.createObjectURL(fileupload.value[0]);
    }
    function removePicture() {
      console.log('')
      emittent.value.picture = ''

    }

    const imageSource: Ref<string> = ref('')
    const fileupload: Ref<any> = ref([])

    function makeSnapshot() {
      $q.dialog({
        title: 'Aktuellen Stand archivieren',
        message: 'Bemerkung zur Archivierung:',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log(data)
        if (store.emittentSource != null) {
          store.createRevision(store.emittentSource, data)
        }

        // console.log('>>>> OK, received', data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }


    function openArchive() {
      $q.dialog({
        component: EmittentArchiv,

        // props forwarded to your custom component
        componentProps: {
          text: 'something',
          // ...more..props...
        }
      }).onOk(() => {
        console.log('OK', store.emittentSource)
        Object.assign(emittent.value, _.cloneDeep(store.emittent))
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })

    }

    function saveChanges() {
      console.log('Saving...')
      if (store != null) {
        Object.assign(store.emittent!, emittent.value)
        store.updateEmittentDetails(store.emittent!, fileupload.value.length > 0 ? fileupload.value[0] as File : null)
      }
    }

    const cols = [
      { name: 'messverfahren', field: 'messverfahren', label: 'Messverfahren' },
      { name: 'datum', field: 'datum', label: 'Messdatum' },
      { name: 'removeMessung', field: 'datum', label: '' }
    ]
    return {
      saveChanges,
      cols,
      tab,
      makeSnapshot,
      openArchive,
      emittent,
      undo,
      redo,
      fileupload,
      imageSource,
      showPicture,
      removePicture,

      selectedMessung,
      createMessung,
      removeMessung,
      handleUndo,
      store
    }
  }
})
</script>
