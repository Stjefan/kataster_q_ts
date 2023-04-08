<template>
  <q-page padding>
    <!--
    <div>
      <q-select :model-value="selectedObject" @update:model-value="handleUpdate" :options="objects" option-label="name" />
      <q-btn label="Hinzufügen" @click="addOption" />
    </div>
    <div v-if="selectedObjectCopy">
      <q-input v-model="selectedObjectCopy.name" />
      <q-input v-model.number="selectedObjectCopy.age" type="number" />
      <q-btn label="Submit" @click="handleSubmit" />
      <q-btn label="Remove" @click="handleRemove(selectedObjectCopy)" />
    </div>
    <br />
    {{ selectedObject }}
    <br />
    {{ objects }}
    <br />
    -->
    <!--
    <forms-schadstoffmessung />-->
    <forms-schallmessung />
    <forms-xlsx-report />
  </q-page>
</template>

<script lang="ts">

interface Person {
  name: string
  age: number
}

interface FormPerson extends Person {
  _isDirty: boolean
}

import { defineComponent, ref, watch } from 'vue'
import * as _ from 'lodash'
import { options } from '@formkit/inputs'
// import FormsSchadstoffmessung from 'src/components/FormsSchadstoffmessung.vue'
import FormsSchallmessung from 'src/components/FormsSchallmessung.vue'
import FormsXlsxReport from 'src/components/FormsXlsxReport.vue'
export default defineComponent({
  components: {
    // FormsSchadstoffmessung,
    FormsSchallmessung, FormsXlsxReport
  },
  // name: 'PageName'

  setup() {
    const objects = ref([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'Bob', age: 40 }
    ])
    const selectedObject = ref(null as (Person | null))
    const selectedObjectCopy = ref(null as Person | null)
    const showWarning = ref(false)

    function handleUpdate(event: Person) {
      console.log(event)
      if (selectedObjectCopy.value != null) {
        if (_.isEqual(selectedObject.value, selectedObjectCopy.value)) {
          console.log('Both are equal - No notifacation')
          selectedObject.value = event
        } else {
          if (confirm('Really want to change?')) {
            selectedObject.value = event
          }
        }
      } else {
        console.log('Initial change without notifacation')
        selectedObject.value = event
      }

    }

    function addOption() {
      objects.value.push({ name: '', age: 40 })

    }

    function handleRemove(args: Person | null) {
      console.log(args)
      // objects.value.splice()

    }

    function handleSubmit() {
      if (selectedObjectCopy.value != null && selectedObject.value != null) {
        // selectedObject.value = { ..._.cloneDeep(selectedObjectCopy.value) }
        Object.assign(selectedObject.value, selectedObjectCopy.value)
      }

    }
    watch(selectedObject, (value: Person | null) => {
      selectedObjectCopy.value = _.cloneDeep(value)
    })

    return {
      handleRemove,
      handleSubmit,
      handleUpdate,
      objects, selectedObject,
      selectedObjectCopy,
      addOption
    }
  },


})
</script>
