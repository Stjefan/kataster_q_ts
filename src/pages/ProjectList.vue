<template>
  <q-page padding>
    <!-- content -->
    <q-select v-model="selectedProject" :options="projects" option-label="name" />
    <q-btn label="Neues Projekt erstellen" @click="create" />
    <project-details v-model:name="selectedProject.name" v-if="selectedProject" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ProjectDetails from 'src/components/ProjectDetails.vue';
import { projectFactory } from 'src/models/v1'
export default defineComponent({
  // name: 'PageName'
  components: { ProjectDetails },
  setup() {
    const projects = ref(projectFactory.buildList(4))

    const selectedProject = ref(projects.value[0])



    return {
      create() {
        projects.value.push(projectFactory.build())

      },
      remove() {
        projects.value.pop()
      },
      update() {
        console.log('Updating...')
      },

      projects,
      selectedProject
    }



  }
})
</script>
