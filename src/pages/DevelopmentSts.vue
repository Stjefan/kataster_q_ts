<template>
  <q-page padding>
    <!-- content -->
    <q-input v-model="files4upload" type="file" />
    <q-btn label="test" @click="test" />
    <q-btn label="create" @click="upload" />
    <q-btn label="delete" @click="remove" />
    {{ response1 }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DefaultMessung from '../components/DefaultMessung.vue'
import { api } from '../boot/axios'
export default defineComponent({
  // name: 'PageName'
  components: {},

  setup() {
    const response1 = ref([] as any[])
    const files4upload = ref([] as any[])

    function remove() {
      api.delete(
        '/upload/2').then(response => console.log(response))
    }
    function upload() {
      for (let f of files4upload.value) {

        let formData = new FormData();
        formData.append('upload', f);
        formData.append('container', '1')
        api
          .post(
            '/upload/',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => console.log(response))
          .catch(e => console.log(e))

      }


    }
    function test() {
      api.get('/container/').then(response => {
        response1.value = response.data
      })

    }

    return {
      test,
      response1,
      files4upload,
      upload,
      remove,
    }
  }
})
</script>
