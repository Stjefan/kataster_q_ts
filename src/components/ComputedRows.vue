<template>
  <div>My component</div>
  <p>{{ foo }}</p>
  <p>
    {{ computedRows }}
  </p>
  <q-btn label="Hinzufügen" @click="$emit('create')" />
  <q-table title="Treats" :rows="computedRows" :columns="columns" row-key="id">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="aCol" :props="props">
          <tr>
            ...
          </tr>
          <tr>
            <q-checkbox v-model="props.row.vorhanden" />
          </tr>
        </q-td>
        <q-td key="bCol" :props="props">
          <tr>
            <q-input type="number" :modelValue="props.row.a1.a"
              @update:modelValue="$emit('update:bCol', { val: $event, target: props.row.id })" />
          </tr>
          <tr>
            <q-input v-model="props.row.a2.a" type="number" />
          </tr>
        </q-td>
        <q-td key="cCol" :props="props">
          <tr>
            {{ props.row.name }}
          </tr>
          <tr>
            {{ props.row.name }}
          </tr>
        </q-td>
        <q-td key="dCol" :props="props">
          <q-btn label="Löschen" @click="$emit('remove', props.row.id)" />
        </q-td>
        <q-td key="eCol" :props="props">
          <tr>
            <q-btn label="Foo" />
          </tr>
          <tr>
            <q-btn label="Bar" />
          </tr>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: ['foo'],
  // name: 'ComponentName'


  setup(props) {
    const columns = [
      { name: 'aCol', align: 'center', label: 'Calories', field: 'aProp', sortable: true },
      { name: 'bCol', align: 'center', label: 'Calories', field: 'aProp', sortable: true },
      { name: 'cCol', align: 'center', label: 'Calories', field: 'aProp', sortable: true },
      { name: 'dCol', align: 'center', label: 'Calories', field: 'aProp', sortable: true },
      { name: 'eCol', align: 'center', label: 'Calories', field: 'aProp', sortable: true },
    ]

    const computedRows = computed({
      get: () => props.foo.map((i: any) => ({ id: i.id, a1: i.propA, a2: i.propB })),
      set: (val) => {
        console.log('setter is called...', val)
      }
    })

    const rows = [
      {
        name: 'Frozen Yogurt',
        aProp: true,
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
      },
      {
        name: 'Ice cream sandwich',
        aProp: true,
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%'
      },
      {
        name: 'Eclair',
        aProp: true,
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%'
      },
      {
        name: 'Cupcake',
        aProp: true,
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%'
      },
      {
        name: 'Gingerbread',
        aProp: true,
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%'
      },
      {
        name: 'Jelly bean',
        aProp: true,
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%'
      },
      {
        name: 'Lollipop',
        aProp: true,
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%'
      },
      {
        name: 'Honeycomb',
        aProp: true,
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%'
      },
      {
        name: 'Donut',
        aProp: true,
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%'
      },
      {
        name: 'KitKat',
        aProp: true,
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%'
      }
    ]
    return {
      columns,
      rows,
      computedRows
    }
  }
})
</script>
