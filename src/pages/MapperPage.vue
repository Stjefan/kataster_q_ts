<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <q-btn label="Read werk" @click="read" />
      <q-btn label="create werk" @click="post" />
      <q-btn label="update werk" />
    </div>
    <div class="row">
      <q-btn label="Read building" @click="read" />
      <q-btn label="create building" @click="createBuilding" />
      <q-btn label="update building" @click="updateBuilding" />
    </div>
    <div class="row">
      <q-btn label="Read roof" @click="read" />
      <q-btn label="create roof" @click="createRoof" />
      <q-btn label="update roof" />
    </div>
    <div class="row">
      <q-btn label="create emittent" @click="createEmittent" />
      <q-btn label="update emittent" @click="updateEmittentDetails" />
    </div>
    <div class="row">
      <q-btn label="Read map" @click="updateMap" />
      <q-btn label="create map" @click="createMap" />
    </div>
    <div class="row">
      <q-btn label="create project" @click="createProject" />
      <q-btn label="update project" @click="upadeProject" />
    </div>
    <q-btn label="mapper" @click="mapperv1" />
    <q-btn label="mapperv2" @click="mapperv2" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'
import { mapper } from 'src/mappings/mapper'
import { Emittent, Roof, buildingFactory, Building, EmittentDetails, emittentDetailsFactory, KarteDetails, Plant, plantFactory, roofFactory, emittentFactory, karteDetailsFactory, metainfoFactory, messwertereiheFactory, projectFactory, Projekt } from 'src/models/v1'
import { Building as BuildingApi, EmittentDetail, KarteApi, Werk, Roof as RoofApi, Emittent as EmittentApi, Project as ProjectApi } from 'src/models/api'
import { AxiosError } from 'axios'
import { errorHandler } from 'src/utility/errorHandling'

export default defineComponent({
  // name: 'PageName'
  setup() {
    const routes = ['werk']
    const methods = ['create', 'read', 'update']
    const x = ref(10)

    function mapperv1() {
      const p = plantFactory.build({ project_id: 1 })

      const w = mapper.map<Plant, Werk>(p, 'Plant', 'Werk')

      const p_line = mapper.map<Werk, Plant>(w, 'Werk', 'Plant')


      console.log(p, w, p_line)


    }

    async function mapperv2() {
      const e = emittentDetailsFactory.build()

      const w = mapper.map<EmittentDetails, EmittentDetail>(e, 'EmittentDetails', 'EmittentDetailsAPI')



      console.log(e, w)

      const id = 7517

      const w_bar = await api.get(`/emittent/details/${id}`).then(response => response.data)

      const e_bar = mapper.map<EmittentDetail, EmittentDetails>(w_bar, 'EmittentDetailsAPI', 'EmittentDetails')

      const w_tilde = mapper.map<EmittentDetails, EmittentDetail>(e_bar, 'EmittentDetails', 'EmittentDetailsAPI')

      console.log(w_bar, e_bar, w_tilde)


    }

    function createEmittent() {
      const id_parent = 472
      const b = emittentFactory.build({ parent: `R${id_parent}` })

      const b_bar = mapper.map<Emittent, EmittentApi>(b, 'Emittent', 'EmittentApi')

      console.log(b, b_bar)

      api.post('/emittent/', b_bar).then(res => console.log(res.data)).catch(errorHandler)

    }

    function createRoof() {
      const id_parent = 109
      const b = roofFactory.build({ parent: `B${id_parent}` })

      const b_bar = mapper.map<Roof, RoofApi>(b, 'Roof', 'RoofApi')

      console.log(b, b_bar)

      api.post('/roof/', b_bar).then(res => console.log(res.data)).catch(errorHandler)

    }

    function createMap() {
      const id_parent = 109
      const b = karteDetailsFactory.build({ zuordnung: 'P122' })

      const b_bar = mapper.map<KarteDetails, KarteApi>(b, 'KarteDetails', 'KarteApi')

      console.log(b, b_bar)
      b_bar.upload = null

      api.post('/map/', b_bar).then(async res => {
        console.log(res.data)
        const f = await api.get<Blob>('http://localhost:8080/favicon.ico', {
          responseType: 'blob'
        })

        let formData = new FormData();
        formData.append('upload', f.data, 'testfile.ico');
        // formData.append('container', '1')
        const r = await api
          .patch(
            `/map/${res.data.id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
        console.log(r.data)

      })
        .catch(errorHandler)
    }

    function updateMap() {
      const id_parent = 783
      api.get(`/map/${id_parent}/`).then(res => {
        console.log(res.data)
        const m = mapper.map<KarteApi, KarteDetails>(res.data, 'KarteApi', 'KarteDetails')
        console.log(m)
        const m_tilde = mapper.map<KarteDetails, KarteApi>(m, 'KarteDetails', 'KarteApi')
        console.log(m_tilde)


      }).catch(errorHandler)

    }



    function updateBuilding() {
      const id_building = 391
      api.get(`/building/${id_building}`).then(res => {

        const b = res.data

        console.log(res.data)

        const b_bar = mapper.map<BuildingApi, Building>(b, 'BuildingApi', 'Building')

        console.log(b_bar)

        b_bar.name = 'Walters Burg'

        const b_tilde = mapper.map<Building, BuildingApi>(b_bar, 'Building', 'BuildingApi')

        console.log(b, b_bar, b_tilde)

        return api.patch(`/building/${id_building}/`, b_tilde)

      }).catch(errorHandler)

    }

    function createBuilding() {
      const b = buildingFactory.build({ parent: 'W109' })

      const b_bar = mapper.map<Building, BuildingApi>(b, 'Building', 'BuildingApi')

      console.log(b, b_bar)

      api.post('/building/', b_bar).then(res => console.log(res.data)).catch(errorHandler)


    }


    function read(args: any) {
      api.get('/werk/112').then(res => console.log(res.data)).catch(err => console.log(err))
    }

    function post() {
      const p = plantFactory.build({ project_id: 1 })
      const p_bar = mapper.map<Plant, Werk>(p, 'Plant', 'Werk')
      console.log(p_bar)
      api.post('/werk/', p_bar).then(res => console.log(res.data)).catch(err => {
        console.log('In error')
        switch (err.response.status) {
          case 400:
            console.log(err.response.data)
            break;
          default:
            console.log(err.response)

        }

      })

      console.log('foo')

    }

    async function updateEmittentDetails() {
      const id = 7517

      const w_bar = await api.get(`/emittent/details/${id}`).then(response => response.data)

      const e_bar = mapper.map<EmittentDetail, EmittentDetails>(w_bar, 'EmittentDetailsAPI', 'EmittentDetails')

      const target = e_bar.messungen[0]?.messpositionen[0]?.messwertereihen[0]
      if (target != null) {
        target.metainfoGesamtpegel = target.metainfoGesamtpegel ?? metainfoFactory.build()
        target.metainfoFremdpegel = target.metainfoFremdpegel ?? metainfoFactory.build()
        target.fremdpegel = target.fremdpegel ?? messwertereiheFactory.build()
      }

      const w_tilde = mapper.map<EmittentDetails, EmittentDetail>(e_bar, 'EmittentDetails', 'EmittentDetailsAPI')

      console.log(w_bar, e_bar, w_tilde)
      delete w_tilde['image']
      const response = await api.patch(`/emittent/details/${id}/`, w_tilde).catch(errorHandler)
      console.log(response)

    }

    function readMap() {
      const map_id = 652
      api.get(`/map/${map_id}`).then(res => {
        console.log(res.data)
        const m = mapper.map<KarteApi, KarteDetails>(res.data, 'KarteApi', 'KarteDetails')
        console.log(m)
        const m_tilde = mapper.map<KarteDetails, KarteApi>(m, 'KarteDetails', 'KarteApi')
        console.log(m_tilde)
      })

    }

    function createProject() {
      const map_id = 652
      const p = projectFactory.build()

      const p_bar = mapper.map<Projekt, ProjectApi>(p, 'Project', 'ProjectApi')

      api.post('/projects/', p_bar).then(res => {
        console.log(res.data)
      }).catch(errorHandler)

    }

    function upadeProject() {
      const map_id = 4
      const p = projectFactory.build()



      api.get(`/projects/${map_id}/`).then(res => {
        console.log(res.data)
        const p_bar = mapper.map<ProjectApi, Projekt>(res.data, 'ProjectApi', 'Project')
        p_bar.name = 'Shipping up to Boston'

        const p_tilde = mapper.map<Projekt, ProjectApi>(p_bar, 'Project', 'ProjectApi')

        return api.patch(`/projects/${map_id}/`, p_tilde)
      }).catch(errorHandler)

    }


    return {
      updateBuilding,
      createBuilding,
      readMap,
      routes,
      methods,
      x,
      post,
      read,
      mapperv1,
      mapperv2,
      createRoof,
      createMap,
      createEmittent,
      updateMap,
      updateEmittentDetails,
      createProject,
      upadeProject,

    }

  }
})
</script>
