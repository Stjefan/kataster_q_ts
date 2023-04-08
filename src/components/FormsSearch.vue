<template>
  <div>My component</div>
  <FormKit type="form" @submit="handleSubmit">
    <FormKit type="list" v-model="values" id="blabla" name="conditions">
      <FormKit v-for="key in items" :key="key" type="group" label="Group">
        <div class="row">
          <FormKit type="text" name="id" :disabled="true" />
          <FormKit type="select" name="pixelX" :options="options" />
          <FormKit type="select" name="pixelY" :options="stringOptions" />
          <FormKit type="select" name="foo" :options="stringOptions" v-if="false" />
          <FormKit type="text" name="gkRechts" />
          <a :data-key="key" href="#" @click="removeItem" class="formkit-remove">Entfernen</a>
        </div>

      </FormKit>
    </FormKit>
  </FormKit>
  <button @click.prevent="addItem">+</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { castNumber } from 'src/utility/errorHandling'
import { uuidv4 } from 'src/models/v1'
export default defineComponent({
  // name: 'ComponentName'
  setup() {

    const options = [
      { label: 'Name', field: 'data.name', type: 'string' },
      { label: 'Bearbeiter', field: 'data.bearbeiter', type: 'string' },


      {
        label: 'Messdatum',
        field: 'data.messungen.0.datum',
        type: 'date',
      },

      { label: 'In Betrieb', field: 'data.inBetrieb', type: 'boolean' },
      {
        label: 'vorgemerkt',
        field: 'data.fuerMessungVormerken',
        type: 'boolean',
      },
      { label: 'liegt an Fassade', field: 'data.liegtAnFassade', type: 'boolean' },
      { label: 'Lage', field: 'data.lage', type: 'emptyCheck' },
      { label: 'Dach', field: 'data.name', type: 'string', conditionFor: 'roof' },
      { label: 'Gebäude', field: 'data.name', type: 'string', conditionFor: 'building' },
      { label: 'Werk', field: 'data.name', type: 'string', conditionFor: 'plant' },
      { label: 'Messungen', field: 'data.messungen.0', type: 'emptyCheck' },
      {
        label: 'Auswertungen',
        field: 'data.messungen.0.auswertung',
        type: 'emptyCheck',
      },
      {
        label: 'Bild',
        field: '_attachments.image',
        type: 'emptyCheck', // Django behandelt Files als Strings
      },
      {
        label: 'Messverfahren',
        field: 'data.messungen.0.messverfahren',
        type: 'string_constrained',
        constrainedOptions: [
          'Quadermessung an 1 reflektierenden Ebene',
          'Quadermessung an 2 reflektierenden Ebenen',
          'Quadermessung an 3 reflektierenden Ebenen',
          'Kugelmessung (default)',
          'Innerhalb einer eckigen Fläche',
          'Innerhalb einer rahmen Fläche',
          'Innerhalb einer Kreisfläche',
          'Innerhalb einer Kreisringfläche',
          'Außerhalb einer eckigen Fläche',
          'Außerhalb einer rahmen Fläche',
          'Außerhalb einer Kreisfläche',
          'Außerhalb einer Kreisringfläche',
          'Innenpegel',
        ].concat(['Kaminmessung (eckig)', 'Kaminmessung (rund)']).concat(['Kühler an Kante']).concat(['runder Kühler']),
      },
      /*
      {
        label: 'Letzte Änderung',
        field: 'modified',
        type: 'date',
      },
      {
        label: 'Erstellt',
        field: 'created',
        type: 'date',
      },
      */
    ];


    const stringOptions = [
      { label: 'entspricht', operator: '$eq', zuordnung: 'filter' },
      { label: 'enthält', operator: '$regex', zuordnung: 'filter' },
      { label: 'enthält nicht', operator: '__contains', zuordnung: 'exclude' },
      { label: 'entspricht nicht', operator: '$ne', zuordnung: 'filter' },
    ];

    const dateOptions = [
      { label: 'vor', operator: '$lt', zuordnung: 'filter' },
      { label: 'am', operator: '$eq', zuordnung: 'filter' },
      { label: 'nach', operator: '$gt', zuordnung: 'filter' },
    ];
    const selectedStringField = ref(stringOptions[0]);
    const selectedDateField: any = ref(null);
    const argumentStringField = ref('');
    const argumentDateField = ref('2022-06-17');

    const booleanOptions = [
      { label: 'wahr', operator: '', zuordnung: 'filter' },
      { label: 'falsch', operator: '', zuordnung: 'filter' },
    ];

    const selectedBooleanField = ref(booleanOptions[0]);

    const emptyCheckOptions = [
      { label: 'vorhanden', operator: '$exists', zuordnung: 'filter' },
      { label: 'nicht vorhanden', operator: '$exists', zuordnung: 'filter' },
    ];
    const emptyCheckField = ref(emptyCheckOptions[0]);


    const values = ref([] as any[])
    const items = ref([] as string[])

    const addItem = () => {
      items.value.push(uuidv4())
    }

    const removeItem = (e: any) => {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(items.value, key)
      console.log([...items.value])
      items.value = items.value.filter(item => item !== key)
      console.log([...items.value])
    }

    function handleSubmit(args: any) {
      console.log(args)
    }

    return {
      uuidv4, addItem, removeItem, items, values, castNumber, stringOptions, handleSubmit, options
    }
  }

})
</script>
