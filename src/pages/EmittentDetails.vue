<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <q-btn label="Undo" @click="undo" />
      <q-btn label="Redo" @click="redo" />
      <q-btn label="Archiv" @click="openArchive" />
      <q-btn label="Archivieren" @click="makeSnapshot" />
    </div>
    <div class="row">
      <div class="col-6 q-pa-md">
        <div v-if="emittent">
          <q-input v-model="emittent.name" label="Name" name="name" />
          <q-input v-model="emittent.bearbeiter" label="Bearbeiter" />
          <q-input v-model="emittent.kostenstelle" label="Kostenstelle" />
          <q-input label="Abteilung" v-model="emittent.abteilung" />
          <q-input label="Messinstitut" v-model="emittent.messinstitut" />
          <q-input label="Anlage" v-model="emittent.anlage" />
          <q-input label="Erstellt:" :model-value="emittent.created" :disable="true" />
          <q-input label="Letzte Änderung:" :model-value="emittent.modified" :disable="true" />

          <q-input label="Höhe" type="number" v-model="emittent.hoehe" />

          <q-input label="GK-Rechts" type="number" v-model="emittent.gkrechts" />
          <q-input label="GK-Hoch" type="number" v-model="emittent.gkhoch" />
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
        <img :src="imageSource" style="max-width: 45vw; max-height: 45vh" />
      </div>
    </div>

    <q-btn label="Neue Messung anlegen" @click="createMessung" />
    <q-table :rows="emittent.messungen" v-model:selected="selectedMessung" selection="single" />
    {{ selectedMessung }}

    <EditMessung v-if="selectedMessung[0]" v-model:datum="selectedMessung[0].datum"
      v-model:blabla="selectedMessung[0]" />
  </q-page>
</template>

<script lang="ts">

import { defineComponent, Ref, ref } from 'vue'

import EditMessung from '../components/EditMessung.vue'
import { Messung, messungFactory, emittentDetailsFactory } from '../models/v1'

import { useRefHistory } from '@vueuse/core'
import { useQuasar } from 'quasar';
import EmittentArchiv from 'src/components/EmittentArchiv.vue';

export default defineComponent({
  components: {
    EditMessung
  },
  // name: 'PageName'
  setup() {

    const $q = useQuasar();

    const emittent = ref(emittentDetailsFactory.build())
    const { history, undo, redo } = useRefHistory(emittent, {
      deep: true,
    })

    const selectedMessung: Ref<Messung[]> = ref([])

    function createMessung() {
      $q.dialog({
        title: 'Neue Messung anlegen',
        message: 'Angewandtes Messverfahren wählen:',
        cancel: true,
        persistent: true,
        options: {
          model: 'opt1',
          // inline: true
          items: [
            { label: '1 Anlage', value: 'opt1', color: 'secondary' },
            { label: '3 Anlagen', value: 'opt3' },
            { label: '4 Anlagen', value: 'opt4' },
            { label: '5 Anlagen', value: 'opt5' }
          ]
        }
      }).onOk(async (data) => {
        console.log(data);
        switch (data) {
          case 'opt1':
            emittent.value.messungen.push((await messungFactory.build({ 'type': '1P' }))!)
            break;
          case 'opt3':
            emittent.value.messungen.push((await messungFactory.build({ 'type': '3P' }))!)
            break;
          case 'opt4':
            emittent.value.messungen.push((await messungFactory.build({ 'type': '4P' }))!)
            break;
          case 'opt5':
            emittent.value.messungen.push((await messungFactory.build({ 'type': '5P' }))!)
            break;
        }


      })

    }
    function removeMessung() {
      console.log('remove')
    }
    function showPicture() {
      console.log('')
      imageSource.value = URL.createObjectURL(fileupload.value[0]);
    }
    function removePicture() {
      console.log('')
      imageSource.value = ''

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
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })

    }
    return {
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
      removeMessung
    }
  }
})
</script>
