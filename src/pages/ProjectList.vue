<template>
  <q-page padding>
    <!-- content -->
    <create-update-project-form />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import ProjectDetails from 'src/components/ProjectDetails.vue';
import { projectFactory } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store';
import { useQuasar } from 'quasar';
import CreateUpdateProjectForm from 'src/components/FormsProject.vue';
export default defineComponent({
  // name: 'PageName'
  components: { CreateUpdateProjectForm },
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
