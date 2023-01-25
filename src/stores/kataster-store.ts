import { defineStore } from 'pinia';
import { getIdFromString, mapper } from 'src/mappings/mapper';
import {
  Building, Emittent, EmittentDetails, emittentDetailsFactory,
  KarteDetails, Messgeraet, messgeraetFactory, Messung, messwertereiheFactory, metainfoFactory, OverviewFile, Plant, plantFactory, PointOnMap, Projekt, RectOnMap, Roof, Vorlage, vorlageFactory
} from 'src/models/v1';

import { MessgeraetApi, Building as BuildingApi, EmittentDetail, KarteApi, Werk, Roof as RoofApi, Emittent as EmittentApi, Project as ProjectApi, TreeNodeApi } from 'src/models/api'

import { api } from 'src/boot/axios';
import { errorHandler } from 'src/utility/errorHandling';

import * as _ from 'lodash'
export const useKatasterStore = defineStore('kataster', {
  state: () => ({
    counter: 0,
    emittent: null as EmittentDetails | null,
    emittentSource: null as Emittent | null,
    messgeraete: [] as Messgeraet[],
    vorlagen: [] as Vorlage[],
    plants: [] as Plant[],
    expandedTreeNodes: [] as number[],
    karteMainPage: null as KarteDetails | null,
    karteMainPageZuordnung: null as Plant | Roof | null,
    pointsOnMap: [] as PointOnMap[],
    rectsOnMap: [] as RectOnMap[],
    reports: [] as Blob[],
    karte2edit: null as KarteDetails | null,
    karte2editZuordnung: null as Plant | Roof | null,
    messung2edit: null as Messung | null,
    project: null as Projekt | null,
    projects: [] as Projekt[],
    developmentMode: true,

    currentArchive: [],
    overviews: [] as OverviewFile[],

  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },

    async sendOverview2Backend(file: File) {
      const formData = new FormData()
      formData.append('upload', file);
      const r = await api
        .post(
          '/overviews/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
      console.log(r.data)
      this.overviews = await api.get('/overviews/').then(response => response.data.results)
    },
    async changeProject() {
      const r3 = await api.get(`/kataster/?project__id=${this.project?.id}`)
      console.log(r3)
      this.plants = r3.data.results.map((i: TreeNodeApi) => mapper.map<TreeNodeApi, Plant>(i, 'TreeNodeApi', 'Plant'))
      console.log(this.plants)
      this.karte2edit = null
      this.rectsOnMap = []
      this.pointsOnMap = []
      this.emittent = null
      this.emittentSource = null
      this.expandedTreeNodes = []

    },
    async init() {
      this.overviews = await api.get('/overviews/').then(response => response.data.results)
      this.messgeraete = await api.get('/messgeraete/').then(response => response.data.results.map((i: any) => messgeraetFactory.build({ name: i.name, idAtBackend: i.id })))
      // this.messgeraete = messgeraetFactory.buildList(3)
      this.vorlagen = await api.get('/reporttemplate/').then(response => response.data.results.map((i: any) => vorlageFactory.build({ name: i.name, idAtBackend: i.id })))
      // this.plants = plantFactory.buildList(2, { project_id: 1 })

      const r1 = await api.get('/projects/')
      console.log(r1)
      this.projects = r1.data.results.map((i: ProjectApi) => mapper.map<ProjectApi, Projekt>(i, 'ProjectApi', 'Project'))
      this.project = this.projects.length == 0 ? null : this.projects[5]
      /*
      const r2 = await api.get('/werk')
      console.log(r2)
      this.plants = r2.data.results.map((i: Werk) => mapper.map<Werk, Plant>(i, 'Werk', 'Plant'))
      */
      const r3 = await api.get(`/kataster/?project__id=${this.project?.id}`)
      console.log(r3)
      this.plants = r3.data.results.map((i: TreeNodeApi) => mapper.map<TreeNodeApi, Plant>(i, 'TreeNodeApi', 'Plant'))
      console.log(this.plants)
      if (this.developmentMode) {
        this.setEmittentDetailsFromEmittent({
          id: '11419',
          koordinaten: { gk_rechts: 1, gk_hoch: 1 }
        } as Emittent)

      }

    },

    createRevision(args: Emittent) {
      api.post(`/revision/${args.id}/`).then(response => response.data)
    },

    readRevisions(args: Emittent) {

      api.get(`/revision/${args.id}/`).then(response => {
        console.log(response.data)
        this.currentArchive = response.data
      })

    },

    revertRevisions(args: Emittent) {

      api.put(`/revision/${args.id}/`).then(response => console.log(response.data))

    },

    async setEmittentDetailsFromEmittent(args: Emittent) {
      const w_bar = await api.get(`/emittent/details/${args.id}`).then(response => response.data)

      const e_bar = mapper.map<EmittentDetail, EmittentDetails>(w_bar, 'EmittentDetailsAPI', 'EmittentDetails')

      this.emittent = e_bar // emittentDetailsFactory.build({ name: args.name })
      console.log('emittent', this.emittent, args, w_bar)
      this.emittentSource = args
    },

    showReversion(arg: EmittentDetail) {
      console.log(arg)
      const e_bar = mapper.map<EmittentDetail, EmittentDetails>(arg, 'EmittentDetailsAPI', 'EmittentDetails')
      this.emittent = e_bar // emittentDetailsFactory.build({ name: args.name })
    },

    createExcelTemplateBackend(arg: Vorlage) {
      const v_bar = {
        name: 'XY'
      }
      api.post('/reporttemplate/', v_bar).then(res => {
        console.log(res.data)
      })
    },

    updateExcelTemplateBackend(arg: Vorlage) {
      const v_bar = {
        name: arg.name,

      }
      api.patch(`/reporttemplate/${arg.idAtBackend}/`, v_bar).then(res => {
        console.log(res.data)
      })
    },

    createMessgeraetBackend(arg: Messgeraet) {
      const p_bar = {
        name: 'a1',
        hz31_5: 10,
        hz63: 11,
        hz125: 12,
        hz250: 13,
        hz500: 14,
        hz1000: 15,
        hz2000: 16,
        hz4000: 17,
        hz8000: 18,

        format_datetime_filename: 'yyyy-MM-dd', format_datetime_overview: 'yyyy-MM-dd'
      }
      api.post('/messgeraete/', p_bar).then(res => {
        console.log(res.data)
      })

    },

    updateMessgeraetBackend(arg: Messgeraet) {
      const p_bar = {
        name: arg.name,
        hz31_5: 10,
        hz63: 11,
        hz125: 12,
        hz250: 13,
        hz500: 14,
        hz1000: 15,
        hz2000: 16,
        hz4000: 17,
        hz8000: 18,

        format_datetime_filename: 'yyyy-MM-dd', format_datetime_overview: 'yyyy-MM-dd'
      }
      api.patch(`/messgeraete/${arg.idAtBackend}/`, p_bar).then(res => {
        console.log(res.data)
      })

    },

    createProjectBackend(arg: Projekt) {
      const p_bar = mapper.map<Projekt, ProjectApi>(arg, 'Project', 'ProjectApi')

      api.post('/projects/', p_bar).then(res => {
        console.log(res.data)
        const p_tilde = mapper.map<ProjectApi, Projekt>(res.data, 'ProjectApi', 'Project')
        console.log(p_tilde)
        this.projects.push(p_tilde)
      }).catch(errorHandler)
    },
    updateProjectBackend(arg: Projekt) {
      const current_id = arg.id
      const p_bar = mapper.map<Projekt, ProjectApi>(arg, 'Project', 'ProjectApi')

      api.patch(`/projects/${current_id}/`, p_bar).then(res => {
        console.log(res.data)
        const p_tilde = mapper.map<ProjectApi, Projekt>(res.data, 'ProjectApi', 'Project')
        console.log(p_tilde)
        const idx = this.projects.findIndex(arg => arg.id == current_id)
        this.projects.splice(idx, 1, p_tilde)
      }).catch(errorHandler)
    },
    createPlantBackend(arg: Plant) {
      const p_bar = mapper.map<Plant, Werk>(arg, 'Plant', 'Werk')
      p_bar.project = 6
      api.post('/werk/', p_bar).then(res => {
        console.log(res.data)
        const p_tilde = mapper.map<Werk, Plant>(res.data, 'Werk', 'Plant')
        console.log(p_tilde)
        this.plants.push(p_tilde)
      }).catch(errorHandler)
    },
    removePlantBackend(arg: Plant) {
      api.delete(`/werk/${arg.id}`).then(res => {
        console.log(res.data)
        const idx = this.plants.findIndex(i => i.id == arg.id)
        const n = this.plants.splice(idx, 1)
        console.log('Removed', n)
      }).catch(errorHandler)

    },
    updatePlantBackend(arg: Plant) {
      const p_bar = mapper.map<Plant, Werk>(arg, 'Plant', 'Werk')
      api.patch(`/werk/${arg.id}/`, p_bar).then(res => {
        console.log(res.data)
        const idx = this.plants.findIndex(i => i.id == arg.id)
      }).catch(errorHandler)

    },
    removeBuildingBackend(arg: Building) {
      api.delete(`/building/${arg.id}`).then(res => {
        console.log(res.data)
        // const idx = this.plants.findIndex(i => i.id == arg.id)
        // const n = this.plants.splice(idx, 1)
        // console.log('Removed', n)
      }).catch(errorHandler)

    },
    removeRoofBackend(arg: Roof) {
      api.delete(`/roof/${arg.id}`).then(res => {
        console.log(res.data)
        // const idx = this.plants.findIndex(i => i.id == arg.id)
        // const n = this.plants.splice(idx, 1)
        // console.log('Removed', n)
      }).catch(errorHandler)

    },
    removeEmittentBackend(arg: Emittent) {
      api.delete(`/emittent/${arg.id}`).then(res => {
        console.log(res.data)
        //const idx = this.plants.findIndex(i => i.id == arg.id)
        //const n = this.plants.splice(idx, 1)
        //console.log('Removed', n)
      }).catch(errorHandler)

    },
    findPlantById(arg: number | string) {
      console.log(this.plants)
      const argAsString = `${arg}`

      return this.plants.find(i => i.id === argAsString)

    },

    findBuildingById(arg: number | string) {
      const argAsString = `${arg}`
      const allBuildings = _.flatMap(this.plants, i => i.children)
      console.log(allBuildings, arg)
      return allBuildings.find(i => i.id == argAsString)
    },
    findRoofById(arg: number | string) {
      const argAsString = `${arg}`
      const allRoofs = _.flatMap(_.flatMap(this.plants, i => i.children), i => i.children)
      console.log(allRoofs, arg)
      return allRoofs.find(i => i.id == argAsString)
    },

    createBuildingBackend(arg: Building, parent_id: number) {
      const p_bar = mapper.map<Building, BuildingApi>(arg, 'Building', 'BuildingApi')
      const parent = this.findPlantById(parent_id)
      p_bar.plant = parent_id
      console.log(p_bar)
      api.post('/building/', p_bar).then(res => {
        console.log(res.data)
        const p_tilde = mapper.map<BuildingApi, Building>(res.data, 'BuildingApi', 'Building')
        parent?.children.push(p_tilde)
        p_tilde.parent = parent!.id

      }).catch(errorHandler)
    },
    updateBuildingBackend(arg: Building) {
      const p_bar = mapper.map<Building, BuildingApi>(arg, 'Building', 'BuildingApi')
      api.patch(`/building/${arg.idAtBackend}/`, p_bar).then(res => {
        console.log(res.data)
        // const idx = this.plants.findIndex(i => i.id == arg.id)
      }).catch(errorHandler)

    },
    createRoofBackend(arg: Roof, parent_id: number) {

      const p_bar = mapper.map<Roof, RoofApi>(arg, 'Roof', 'RoofApi')
      p_bar.building = parent_id
      api.post('/roof/', p_bar).then(res => {
        console.log(res.data, arg, parent_id)
        const p_tilde = mapper.map<RoofApi, Roof>(res.data, 'RoofApi', 'Roof')

        const r = this.findBuildingById(`${parent_id}`)
        r?.children.push(p_tilde)
        p_tilde.parent = r!.id
        console.log(p_tilde)
      }).catch(errorHandler)
    },
    createEmittentBackend(arg: Emittent, parent_id: number) {
      arg.parent = `${parent_id}`
      const p_bar = mapper.map<Emittent, EmittentApi>(arg, 'Emittent', 'EmittentApi')
      api.post('/emittent/', p_bar).then(res => {
        console.log(res.data)
        const p_tilde = mapper.map<EmittentApi, Emittent>(res.data, 'EmittentApi', 'Emittent')
        const r = this.findRoofById(parent_id)
        p_tilde.parent = r!.id
        r?.children.push(p_tilde)
        console.log(p_tilde)
      }).catch(errorHandler)
    },
    async updateEmittentDetails(e_bar: EmittentDetails, imageFile: File | null) {
      console.log(e_bar)
      const id = e_bar.id // 7517

      // const w_bar = await api.get(`/emittent/details/${id}`).then(response => response.data)

      // const e_bar = mapper.map<EmittentDetail, EmittentDetails>(w_bar, 'EmittentDetailsAPI', 'EmittentDetails')

      if (false) {

        // const target = e_bar.messungen[0]?.messpositionen.get(1)?.messwertereihen[0]
        // if (target != null) {
        //   target.metainfoGesamtpegel = target.metainfoGesamtpegel ?? metainfoFactory.build()
        //   target.metainfoFremdpegel = target.metainfoFremdpegel ?? metainfoFactory.build()
        //   target.fremdpegel = target.fremdpegel ?? messwertereiheFactory.build()
        // }

      }

      const w_tilde = mapper.map<EmittentDetails, EmittentDetail>(e_bar, 'EmittentDetails', 'EmittentDetailsAPI')


      // console.log(w_bar, e_bar, w_tilde)
      delete w_tilde['image']
      console.log(w_tilde)
      const response = await api.patch(`/emittent/details/${id}/`, w_tilde).catch(errorHandler)
      console.log(response)

      const image = w_tilde['image']
      if (imageFile != null) {
        const formData = new FormData();
        // formData.append('upload', f.data, 'testfile.ico');
        formData.append('image', imageFile);
        const r = await api
          .patch(
            `/emittent/details/${id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
        console.log(r.data)
      }

      await this.setEmittentDetailsFromEmittent(this.emittentSource!)

    },
    async createKarteDetailsBackend(arg: KarteDetails, iamgeFile: File | null) {

      const b_bar = mapper.map<KarteDetails, KarteApi>(arg, 'KarteDetails', 'KarteApi')

      b_bar.upload = null

      if (this.karte2editZuordnung != null) {

        if (this.karte2editZuordnung?.body == 'werk') {
          b_bar.plant_set = [getIdFromString(this.karte2editZuordnung.id)]

        } else if (this.karte2editZuordnung?.body == 'dach') {
          b_bar.roof_set = [getIdFromString(this.karte2editZuordnung.id)]

        }
      }

      let req = null
      const id_karte_details = arg.id.toString()
      if (id_karte_details.match(/^[a-zA-Z]/)) {
        req = await api.post('/map/', b_bar)
      } else {

        req = await api.patch(`/map/${b_bar.id}/`, b_bar)
      }

      if (this.karte2editZuordnung?.body == 'werk') {
        const r = this.findPlantById(this.karte2editZuordnung.id)
        if (r != null)
          r.map = this.karte2edit!

      } else if (this.karte2editZuordnung?.body == 'dach') {
        const r = this.findRoofById(this.karte2editZuordnung.id)
        if (r != null)
          r.map = this.karte2edit!

      }
      console.log(req.data)

      const f = await api.get<Blob>('http://localhost:8080/favicon.ico', {
        responseType: 'blob'
      })

      if (iamgeFile != null) {
        const formData = new FormData();
        // formData.append('upload', f.data, 'testfile.ico');
        formData.append('upload', iamgeFile, 'testfile.ico');
        // formData.append('container', '1')
        const r = await api
          .patch(
            `/map/${req.data.id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          ).catch(errorHandler)
        console.log(r)
      }


    }
  },
});
