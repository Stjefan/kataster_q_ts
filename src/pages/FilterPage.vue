<template>
  <q-page padding>
    <!-- content -->
    <q-btn label="Bedingung hinzufügen" @click="addCondition" />
    <condition-component :options="options" v-for="(c, idx) in conditions" :key="idx" @remove="removeCondition(idx)"
      ref="conditionComponent" />
    <q-btn label="Filtern" @click="buildQuery" />
    <q-table :rows="filteredEmittents" :columns="cols">
      <template v-slot:body-cell-edit="props">
        <q-td>
          <q-btn label="Bearbeiten" @click="handleEdit(props.row)" />
        </q-td>
      </template></q-table>
    <filter-ergebnis />
  </q-page>
</template>

<script lang="ts">
import ConditionComponent from 'src/components/ConditionComponent.vue';
import FilterErgebnis from 'src/components/FilterErgebnis.vue';
import { useKatasterStore } from 'src/stores/kataster-store';
import { defineComponent, ref, } from 'vue'
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { ein_punkt_messverfahren, vier_punkt_messverfahren } from 'src/models/v1';
export default defineComponent({
  components: { ConditionComponent, FilterErgebnis },
  // name: 'PageName'
  setup() {
    const router = useRouter()
    const store = useKatasterStore()
    function addCondition() {
      conditions.value.push(1);
    }
    const filteredEmittents = ref([] as any[])
    function removeCondition(args: any) {
      console.log(args);
      conditions.value.splice(args, 1);
    }
    const conditions = ref([1]);
    const options = [
      { label: 'Name', field: 'name', type: 'string' },
      {
        label: 'Messdatum',
        field: 'ein_punkt_messungen__messdatum',
        type: 'date',
      },
      { label: 'In Betrieb', field: 'in_betrieb', type: 'boolean' },
      {
        label: 'vorgemerkt',
        field: 'fuer_messung_vormerken',
        type: 'boolean',
      },
      { label: 'liegt an Fassade', field: 'liegt_an_fassade', type: 'boolean' },
      { label: 'Lage', field: 'lage', type: 'emptyCheck' },
      { label: 'Dach', field: 'roof__name', type: 'string' },
      { label: 'Gebäude', field: 'roof__buidling__name', type: 'string' },
      { label: 'Messungen', field: 'ein_punkt_messungen', type: 'emptyCheck' },
      {
        label: 'Auswertungen',
        field: 'ein_punkt_messungen__auswertung',
        type: 'emptyCheck',
      },
      {
        label: 'Bild',
        field: 'upload',
        type: 'string', // Django behandelt Files als Strings
      },
      {
        label: 'Messverfahren (1 Messposition)',
        field: 'ein_punkt_messungen__typ',
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
        ],
      },
      {
        label: 'MultiFieldOrCondition',
        field: 'kamin_messungen__typ',
        multi_fields: ['ein_punkt_messungen__typ', 'kamin_messungen__typ'],
        type: 'string_constrained',
        constrainedOptions: ['Kaminmessung (eckig)', 'Kaminmessung (rund)'],

      },


      {
        label: 'Messverfahren (Kamin)',
        field: 'kamin_messungen__typ',
        type: 'string_constrained',
        constrainedOptions: ['Kaminmessung (eckig)', 'Kaminmessung (rund)'],
      },
      {
        label: 'Kühlermessverfahren (an Kante)',
        field: 'vier_punkt_messungen__typ',
        type: 'string_constrained',
        constrainedOptions: ['Kühler an Kante'],
      },
      {
        label: 'Kühlermessverfahren (rund)',
        field: 'vier_punkt_messungen__typ',
        type: 'string_constrained',
        constrainedOptions: ['runder Kühler'],
      },
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
    ];

    const conditionComponent: any = ref(null);

    function buildQuery(args: any) {
      console.log(args);

      console.log(conditionComponent.value);
      const allConditions = conditionComponent.value.map((i: any) =>
        i.buildCondition()
      );
      console.log(allConditions);

      let mergedConditions = {
        filter: {
          roof__building__plant__project__id: store.project?.id,
        },
        exclude: {},
        groups: {
          '$or': [
            { ein_punkt_messungen__typ: 'Quadermessung an 1 reflektierenden Ebene' },
            { kamin_messungen__typ: 'Kaminmessung (eckig)' },
            { 'vier_punkt_messungen__typ': 'Kühler an Kante' }

          ],
        }
      };
      for (const c of allConditions) {
        mergedConditions.filter = { ...mergedConditions.filter, ...c.filter };
        mergedConditions.exclude = {
          ...mergedConditions.exclude,
          ...c.exclude,
        };
      }
      console.log(mergedConditions);
      //runFilterV2(mergedConditions);

      api.put('/filter/', mergedConditions).then(response => {
        console.log(response)
        filteredEmittents.value = response.data
      })

    }

    const cols = [
      { label: 'Name', field: 'name' },
      { label: 'Rechtswert', field: (arg: any) => arg.lage?.gk_rechts },
      { label: 'Hochwert', field: (arg: any) => arg.lage?.gk_hoch },
      { label: '', name: 'edit' }
    ]

    async function handleEdit(args: any) {
      console.log(args)
      await store.setEmittentDetailsFromEmittent(args)
      router.push({ name: 'emittent' })


    }

    return { filteredEmittents, options, conditions, addCondition, removeCondition, buildQuery, conditionComponent, cols, handleEdit }

  }
})
</script>
