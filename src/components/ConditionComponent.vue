<template>
  <div class="row q-pa-md q-gutter-sm">
    <q-select :options="options" v-model="selected" option-label="label" class="col-2" />
    <q-select v-if="selected.type == 'string' || selected.type == 'string_constrained'" :options="stringOptions"
      v-model="selectedStringField" class="col-2" />
    <q-input v-if="selected.type == 'string'" v-model="argumentStringField" class="col-2" />
    <q-select v-if="selected.type == 'string_constrained'" :options="selected.constrainedOptions"
      v-model="argumentStringField" class="col-2" />
    <q-select v-if="selected.type == 'date'" :options="dateOptions" v-model="selectedDateField" class="col-2" />
    <q-input v-if="selected.type == 'date'" v-model="argumentDateField" type="date" class="col-2" />
    <q-select v-if="selected.type == 'emptyCheck'" :options="emptyCheckOptions" v-model="emptyCheckField" class="col-2" />
    <q-select v-if="selected.type == 'boolean'" :options="booleanOptions" v-model="selectedBooleanField" class="col-2" />
    <q-btn label="Bedingung entfernen" @click="$emit('remove')" class="col-2" />
  </div>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { ref, computed } from 'vue';
export default {
  // name: 'ComponentName',
  props: ['options'],
  setup(props: any, context: any) {

    const selected: any = ref(props.options[0]);
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

    function buildCondition(emitEvent = false) {
      interface Bla {
        [state: string]: any

      }
      console.log(selected.value);
      const myResult: Bla = { filter: {}, exclude: {} };

      if (
        selected.value.type == 'string' ||
        selected.value.type == 'string_constrained'
      ) {
        const op = selectedStringField.value.operator
        const q = {} as any
        let valField
        if (op == '$regex') {
          valField = new RegExp(`.*${argumentStringField.value}.*`, 'i'); // /.*${argumentStringField.value}.*/i
        } else {
          valField = argumentStringField.value
        }
        // const re = new RegExp(`.*${argumentStringField.value}.*`, 'i');
        q[op] = valField // re
        myResult[selectedStringField.value.zuordnung][
          selected.value.field
        ] = q

        console.log('String', myResult[selectedStringField.value.zuordnung]);

      } else if (selected.value.type == 'emptyCheck') {
        console.log(myResult[emptyCheckField.value.zuordnung]);

        myResult[emptyCheckField.value.zuordnung][
          selected.value.field
        ] = {
          '$exists': emptyCheckField.value.label === 'vorhanden' ? true : false

        }
      } else if (selected.value.type == 'boolean') {
        myResult[selectedBooleanField.value.zuordnung][
          selected.value.field + selectedBooleanField.value.operator
        ] = selectedBooleanField.value.label === 'wahr' ? true : false;
      } else if (selected.value.type == 'date') {
        const q = {} as any
        q[selectedDateField.value.operator] = new Date(argumentDateField.value).getTime();
        myResult[selectedDateField.value.zuordnung][
          selected.value.field
        ] = q
      }

      console.log(myResult);
      if (emitEvent) {
        context.emit('run-query', myResult);
      }

      myResult['conditionFor'] = selected.value.conditionFor

      return myResult;

    }
    return {
      buildCondition,
      selected,
      argumentStringField,
      selectedStringField,
      stringOptions,
      argumentDateField,
      selectedDateField,
      dateOptions,
      emptyCheckOptions,
      emptyCheckField,
      booleanOptions,
      selectedBooleanField,
    };
  },
};
</script>

