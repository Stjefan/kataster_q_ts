<template>
  <q-page padding>
    <!-- content -->
    <q-select v-model="selectedProject" :options="projects" option-label="name" />
    <q-btn label="Projekt auswählen" @click="chooseProject" :disable="selectedProject == null" />
    <q-btn label="Neues Projekt erstellen" @click="create" />
    <project-details v-model:name="selectedProject.name" v-if="selectedProject" @save="aktualisieren" />
    {{ store.project }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import ProjectDetails from 'src/components/ProjectDetails.vue';
import { projectFactory } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store';
export default defineComponent({
  // name: 'PageName'
  components: { ProjectDetails },
  setup() {




    const store = useKatasterStore()



    const projects = computed(() => store.projects)
    const selectedProject = ref(projects.value[0])

    return {
      create() {
        // projects.value.push(projectFactory.build())

        const p = projectFactory.build()
        store.createProjectBackend(p)

      },
      remove() {
        projects.value.pop()
      },
      update() {
        console.log('Updating...')
      },
      chooseProject() {
        store.$patch({
          project: selectedProject.value
        })
        store.changeProject()
      },
      aktualisieren() {
        console.log('aktualisieren...')

        store.updateProjectBackend(selectedProject.value)
      },

      projects,
      store,
      selectedProject
    }



  }
})
</script>
