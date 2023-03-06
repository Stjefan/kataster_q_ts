<template>
  <q-page padding>
    <!-- content -->
    <div>Aktuelle Auswahl:</div>
    {{ store.project?.name }}
    <q-select v-model="selectedProject" :options="projects" option-label="name" />
    <q-btn label="Projekt auswählen" @click="chooseProject" :disable="selectedProject == null" />
    <q-btn label="Neues Projekt erstellen" @click="create" />
    <project-details v-model:name="selectedProject.name" v-if="selectedProject" @save="aktualisieren"
      @remove="remove" />
    {{ store.project }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import ProjectDetails from 'src/components/ProjectDetails.vue';
import { projectFactory } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store';
import { useQuasar } from 'quasar';
export default defineComponent({
  // name: 'PageName'
  components: { ProjectDetails },
  setup() {
    const $q = useQuasar()



    const store = useKatasterStore()



    const projects = computed(() => store.projects)
    const selectedProject = ref(projects.value[0])

    return {
      create() {
        $q.dialog({
          title: 'Projekt anlegen',
          message: 'Bezeichnung',
          cancel: true,
          persistent: true,
          prompt: {
            model: '',
            type: 'text' // optional
          },
        }).onOk(async (data) => {
          console.log(data);
          // projects.value.push(projectFactory.build())

          const p = projectFactory.build({ name: data, dbName: (data as string).toLowerCase().replace(' ', '-') })
          store.createProjectBackend(p)

        })
      },
      remove() {
        store.removeProject(selectedProject.value)

      },
      update() {
        console.log('Updating...')
      },
      chooseProject() {
        store.changeProject(selectedProject.value)
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
