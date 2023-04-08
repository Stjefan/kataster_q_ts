<template>
  <q-page padding>
    <!-- content -->
    <create-update-project-form />
    <q-btn label="Complex File-Management" @click="foo" />
    <br />
    <vorlage-details />
    <div>ABC</div>
    <forms-again />
  </q-page>
</template>

<script lang="ts">
import CreateUpdateProjectForm from 'src/components/CreateUpdateProjectForm.vue'
import VorlageDetails from 'src/components/VorlageDetails.vue'
import { uuidv4 } from 'src/models/v1'
import { defineComponent } from 'vue'
import * as _ from 'lodash'
import FormsAgain from 'src/components/FormsAgain.vue'
export default defineComponent({
  components: { CreateUpdateProjectForm, VorlageDetails, FormsAgain },
  // name: 'PageName'
  setup() {
    function foo() {
      console.log('foo')
      const base_arr_before = [
        { id: uuidv4(), name: 'a' }, { id: uuidv4(), name: 'b' }, { id: uuidv4(), name: 'c' }, { id: uuidv4(), name: 'd', }
      ]
      const arr_1 = base_arr_before.map(i => `${i.id}_permission`)
      const arr_2 = base_arr_before.map(i => `${i.id}_measurement_14`)

      const combined = arr_1.concat(arr_2)
      const combined_with_additional = combined.concat('image_1')

      const r1 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}_permission/

      const r2 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}_measurement_\d+/

      const permissions = combined_with_additional.map(i => i.match(r1))
      const measurements = combined_with_additional.map(i => i.match(r2))

      console.log(arr_1, arr_2)



      const base_arr_after = [{ ...base_arr_before[0], name: 'a2' }, base_arr_before[3], { ...base_arr_before[2] }, { id: uuidv4(), name: 'a1', }]


      console.log(_.keyBy(base_arr_before, 'id'), _.keyBy(base_arr_after, 'id'));

      console.log(_.differenceWith(base_arr_before, base_arr_after, _.isEqual));

      console.log('Edited or Created', _.differenceWith(base_arr_after, base_arr_before, _.isEqual));

      console.log('Unchanged', _.intersectionWith(base_arr_before, base_arr_after, _.isEqual))

      const array2insert = []

      //console.log('Merged', _.merge(base_arr_before, base_arr_after))
      // TODO: Für Dokuemnte von Auswertungen ebenfalls einbauen

      console.log('Changed')
      console.log('Deleted')
      console.log('created')
    }
    return {
      foo,
    }
  }
})
</script>
