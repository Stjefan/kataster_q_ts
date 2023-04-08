<template>
  <q-page padding>
    <!-- content -->
    <q-btn label="Bedingung hinzufügen" @click="addCondition" />
    <condition-component :options="options" v-for="(c, idx) in conditions" :key="idx" @remove="removeCondition(idx)"
      ref="conditionComponent" />
    <q-btn label="Filtern" @click="buildQuery" />
    <div>
      {{ condition1 }}
      <br />
      {{ conditionList }}
    </div>

    <form-kit type="form" @submit="handleSubmit">
      <form-kit type="list" v-model="conditionList">
        <form-kit type="group" name="condition" v-model="condition1">
          <form-kit type="select" :options="processedOptions" name="field" />
          <div v-if="condition1.field?.type == 'string'">
            <form-kit type="select" :options="stringOptions" name="comperator" v-model="condition1.comperator" />
            <form-kit type="text" name="comperatorArgument" v-model="condition1.comperatorArgument" />
          </div>
          <div v-else-if="condition1.field?.type == 'date'">
            <form-kit type="select" :options="dateOptions" name="comperator" v-model="condition1.comperator" />
            <form-kit type="date" name="comperatorArgument" v-model="condition1.comperatorArgument" />
          </div>
          <form-kit type="button" label="+" />
        </form-kit>
      </form-kit>
    </form-kit>
    <q-table :rows="filteredEmittents" :columns="cols">
      <template v-slot:body-cell-edit="props">
        <q-td>
          <q-btn label="Bearbeiten" @click="handleEdit(props.row)" />
        </q-td>
      </template>
      <template v-slot:body-cell-checked="props">
        <q-td>
          <q-toggle v-model="props.row.checked" />
        </q-td>
      </template>
    </q-table>
    <filter-ergebnis />
  </q-page>
</template>

<script lang="ts">
import ConditionComponent from 'src/components/ConditionComponent.vue';
import FilterErgebnis from 'src/components/FilterErgebnis.vue';
import { useKatasterStore } from 'src/stores/kataster-store';
import { computed, defineComponent, ref, } from 'vue'
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { ein_punkt_messverfahren, filterResultFactory, vier_punkt_messverfahren } from 'src/models/v1';
export default defineComponent({
  components: { ConditionComponent, FilterErgebnis },
  // name: 'PageName'
  setup() {
    const router = useRouter()
    const store = useKatasterStore()
    function addCondition() {
      conditions.value.push(1);
    }
    function handleSubmit(args: any) {
      console.log(args)
    }
    const filteredEmittents = ref([] as any[])
    function removeCondition(args: any) {
      console.log(args);
      conditions.value.splice(args, 1);
    }


    const conditions = ref([1]);
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

    const stringOptions = [{ label: 'entspricht', value: 1, }, { label: 'enthält', value: 2 }]
    const dateOptions = [{ label: 'vor', value: 1 }]

    const processedOptions = computed(() => {
      return options.map(i => ({
        label: i.label, value: i
      }))

    })

    const conditionComponent: any = ref(null);

    async function buildQuery(args: any) {
      console.log(args);

      console.log(conditionComponent.value);
      const allConditions = conditionComponent.value.map((i: any) =>
        i.buildCondition()
      );
      console.log('all conditions', allConditions);

      let mergedConditions = {
        filter: {
        },
        exclude: {},
      };
      let conditionsOnRoof = {}
      let conditionsOnBuilding = {}
      let conditionsOnPlant = {}
      for (const c of allConditions) {
        if (c.conditionFor == 'roof') {
          conditionsOnRoof = { ...conditionsOnRoof, ...c.filter }

        } else if (c.conditionFor == 'building') {
          conditionsOnBuilding = { ...conditionsOnBuilding, ...c.filter }

        } else if (c.conditionFor == 'plant') {
          conditionsOnPlant = { ...conditionsOnPlant, ...c.filter }

        } else
          mergedConditions.filter = { ...mergedConditions.filter, ...c.filter };
        /*
        mergedConditions.exclude = {
          ...mergedConditions.exclude,
          ...c.exclude,
        };
        */
      }
      console.log('Conditions 2 check', mergedConditions, conditionsOnRoof);
      //runFilterV2(mergedConditions);

      const results = await store.runQueryOnEmittents(
        {
          //'data.name': 'E22',
          // 'data.inBetrieb': true,
          // 'data.lage.gkhoch': { $gt: 1 }
          //'data.name': { '$regex': /.*Q001.*/ }
          ...mergedConditions.filter
        }, conditionsOnRoof, conditionsOnBuilding, conditionsOnPlant)

      filteredEmittents.value = results.map((i: any) => filterResultFactory.build({ name: i.name, id: i.id, gkhoch: i.lage?.gkhoch, gkrechts: i.lage.gkrechts }))


      if (false) {
        api.put('/filter/', mergedConditions).then(response => {
          console.log(response)
          filteredEmittents.value = response.data.map((i: any) => filterResultFactory.build({ name: i.name, id: i.id }))
        })


      }

    }

    const cols = [
      { label: 'Name', field: 'name' },
      { label: 'Rechtswert', field: (arg: any) => arg.gkrechts },
      { label: 'Hochwert', field: (arg: any) => arg.gkhoch },
      { label: '', name: 'edit' },
      { label: '', field: 'checked', name: 'checked' }
    ]

    async function handleEdit(args: any) {
      console.log(args)
      await store.setEmittentDetailsFromEmittent(args)
      router.push({ name: 'emittent' })


    }

    const condition1 = ref({})

    const conditionList = ref([])

    return {
      conditionList, condition1, filteredEmittents, options, conditions, addCondition, removeCondition, buildQuery, conditionComponent, cols, handleEdit, handleSubmit, processedOptions,
      stringOptions, dateOptions
    }

  }
})
</script>
