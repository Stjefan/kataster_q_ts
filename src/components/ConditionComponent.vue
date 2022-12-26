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
    <q-select v-if="selected.type == 'emptyCheck'" :options="emptyCheckOptions" v-model="emptyCheckField"
      class="col-2" />
    <q-select v-if="selected.type == 'boolean'" :options="booleanOptions" v-model="selectedBooleanField"
      class="col-2" />
    <q-btn label="Bedingung entfernen" @click="$emit('remove')" class="col-2" />
  </div>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { ref, computed, defineEmits } from 'vue';
export default {
  // name: 'ComponentName',
  props: ['options'],
  setup(props: any, context: any) {
    const emit = defineEmits(['run-query']);

    const selected: any = ref(props.options[0]);
    const stringOptions = [
      { label: 'entspricht', operator: '', zuordnung: 'filter' },
      { label: 'enthält', operator: '__contains', zuordnung: 'filter' },
      { label: 'enthält nicht', operator: '__contains', zuordnung: 'exclude' },
      { label: 'entspricht nicht', operator: '', zuordnung: 'exclude' },
    ];

    const dateOptions = [
      { label: 'vor', operator: '__date__lt', zuordnung: 'filter' },
      { label: 'am', operator: '__date', zuordnung: 'filter' },
      { label: 'nach', operator: '__date__gt', zuordnung: 'filter' },
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
      { label: 'vorhanden', operator: '__isnull', zuordnung: 'filter' },
      { label: 'nicht vorhanden', operator: '__isnull', zuordnung: 'filter' },
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
        console.log(myResult[selectedStringField.value.zuordnung]);
        myResult[selectedStringField.value.zuordnung][
          selected.value.field + selectedStringField.value.operator
        ] = argumentStringField.value;
      } else if (selected.value.type == 'emptyCheck') {
        console.log(myResult[emptyCheckField.value.zuordnung]);
        myResult[emptyCheckField.value.zuordnung][
          selected.value.field + emptyCheckField.value.operator
        ] = emptyCheckField.value.label === 'vorhanden' ? false : true;
      } else if (selected.value.type == 'boolean') {
        myResult[selectedBooleanField.value.zuordnung][
          selected.value.field + selectedBooleanField.value.operator
        ] = selectedBooleanField.value.label === 'wahr' ? true : false;
      } else if (selected.value.type == 'date') {
        myResult[selectedDateField.value.zuordnung][
          selected.value.field + selectedDateField.value.operator
        ] = argumentDateField.value;
      }

      console.log(myResult);
      if (emitEvent) {
        context.emit('run-query', myResult);
      }

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

