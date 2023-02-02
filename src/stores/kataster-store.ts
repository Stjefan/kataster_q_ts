import { defineStore } from 'pinia';
import { getIdFromString, mapper } from 'src/mappings/mapper';
import {
  Building, Emittent, EmittentDetails, emittentDetailsFactory,
  KarteDetails, karteDetailsFactory, Messgeraet, messgeraetFactory, Messung, messwertereiheFactory, metainfoFactory, OverviewFile, Plant, plantFactory, PointOnMap, Projekt, RectOnMap, Roof, Vorlage, vorlageFactory
} from 'src/models/v1';

import { MessgeraetApi, Building as BuildingApi, EmittentDetail, KarteApi, Werk, Roof as RoofApi, Emittent as EmittentApi, Project as ProjectApi, TreeNodeApi } from 'src/models/api'

import { api } from 'src/boot/axios';
import { errorHandler } from 'src/utility/errorHandling';

import { v4 as uuidv4 } from 'uuid';

import PouchDB from 'pouchdb-browser';
import find from 'pouchdb-find'
import rel from 'relational-pouch';



PouchDB.plugin(find);
PouchDB.plugin(rel);

const db = new PouchDB('mydb6');

const masterDb = new PouchDB('main')

const relDB = db.setSchema([
  {
    singular: 'plant',
    plural: 'plants',
    // relations: {
    //   'buildings': { hasMany: { type: 'building', options: { queryInverse: 'plant' } } }
    // }
  },
  {
    singular: 'building',
    plural: 'buildings',
    relations: {
      'plant': { belongsTo: 'plant' },
      // 'roofs': { hasMany: { type: 'roof', options: { queryInverse: 'building' } } }
    }
  },
  {
    singular: 'roof',
    plural: 'roofs',
    relations: {
      'building': { belongsTo: 'building' },
      // 'emittents': { hasMany: { type: 'emittent', options: { queryInverse: 'roof' } } }
    }
  },

  {
    singular: 'emittent',
    plural: 'emittents',
    relations: {
      'roof': { belongsTo: 'roof' }
    }
  },

  {
    singular: 'emittentBackup',
    plural: 'emittentsBackups',
    relations: {
      'backsUp': { belongsTo: 'emittent' }
    }
  },

  {
    singular: 'overview',
    plural: 'overviews',
  },

  {
    singular: 'map',
    plural: 'maps',
  },


]);


import * as _ from 'lodash'
import { useStorage } from '@vueuse/core';
import { PouchBuilding, PouchEmittent, PouchPlant, PouchRoof } from 'src/models/pouch-api';
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
    developmentMode: false,
    offlineMode: false,

    currentArchive: [],
    overviews: [] as OverviewFile[],

  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async loadAllEmittentDetailsIntoStorage() {
      const allEmittents = _.flatMap(_.flatMap(_.flatMap(this.plants, i => i.children), i => i.children), i => i.children)

      console.log(allEmittents)
      const batchSize = 2 ** 6
      for (let i = 0; i < allEmittents.length; i += batchSize)
        await Promise.all(allEmittents.slice(i, i + batchSize).map(i => api.get(`/emittent/details/${i.id}`).then(response => relDB.rel.save(
          'emittent',
          { ...response.data, id: uuidv4(), descriminator: 'emittent' }
        )))).then(
          docs => console.log(docs)

        )
    },

    async loadMapFromPouch() {
      const allMaps = await relDB.rel.find('map')
      console.log('Maps in db', allMaps)
      // await relDB.rel.del('map', allMaps.maps[0])
      const myBlob = await relDB.rel.getAttachment('map', allMaps.maps[Math.floor(Math.random() * allMaps.maps.length)].id, 'image')

      console.log(myBlob)

      this.karteMainPage = karteDetailsFactory.build({
        url: URL.createObjectURL(myBlob as Blob)
      })

    },

    destroyPouch() {
      db.destroy().then(res => console.log(res))
    },

    async funWithPouch() {
      const docs = await db.allDocs({ include_docs: true })
      console.log(docs)

      console.log(await relDB.rel.find('emittent'))


    },



    async funWithBaumstruktur() {
      if (false) {
        const id_plant = uuidv4()
        const id_building = uuidv4()
        const result_plant = await relDB.rel.save('plant', { name: 'c', buildings: [], id: id_plant })
        const p_db = (await relDB.rel.find('plant', result_plant.id)).plants[0]


        const result_b = await relDB.rel.save('building', { name: 'b1', id: id_building })
        console.log(result_b, p_db)
        p_db.buildings.push(id_building)
        await relDB.rel.save('plant', { ...p_db })
      }
      console.log('Start')
      if (true) {
        for (const p of this.plants) {
          const id_plant = uuidv4()
          const p_no_id = { ...p, id: id_plant, buildings: [], children: [] } as any
          delete p_no_id.children
          const result_plant = await relDB.rel.save('plant', p_no_id)
          const p_db = (await relDB.rel.find('plant', result_plant.id)).plants[0]
          console.log('p', p_db)
          for (const b of p.children) {
            const id_building = uuidv4()
            const b_no_id = { ...b, id: id_building, roofs: [], plant: p_db.id } as any
            delete b_no_id.parent
            delete b_no_id.children
            const result_b = await relDB.rel.save('building', b_no_id)
            // const building_db = (await relDB.rel.find('building', id_building)).buildings[0]
            // p_db.buildings.push(id_building)
            console.log(result_b, b_no_id.id)
            for (const r of b.children) {
              const id_roof = uuidv4()
              const r_modified = { ...r, id: id_roof, building: id_building, emittents: [] } as any
              delete r_modified.children
              const result_r = await relDB.rel.save('roof', r_modified)
              // building_db.roofs.push(id_roof)

              const roof_db = (await relDB.rel.find('roof', id_roof)).roofs[0]
              console.log(r.children, r)
              for (const e of r.children) {
                const id_emittent = uuidv4()
                const e_modified = { ...e, id: id_emittent, roof: id_roof }
                if (false) {
                  const result_e = await relDB.rel.save('emittent', e_modified)
                  console.log(result_e)
                } else {
                  api.get(`/emittent/details/${e.id}`).then(response => relDB.rel.save(
                    'emittent',
                    { ...response.data, id: uuidv4(), descriminator: 'emittent', roof: id_roof }
                  ))
                }


                // roof_db.emittents.push(id_emittent)
              }
              // console.log('To be saved', roof_db)
              // await relDB.rel.save('roof', roof_db)

              // building_db.roofs.push(id_roof)

            }
            // await relDB.rel.save('building', building_db)

          }
          await relDB.rel.save('plant', p_db)

        }
      }

    },

    async funWithBackup() {
      const emittent = (await relDB.rel.find('emittent')).emittents[0]
      const backup = { ...emittent, backsUp: emittent.id } as any
      delete backup.id
      delete backup.rev
      const res = await relDB.rel.save('emittentBackup', backup)
      console.log(res)
      console.log('allBackups', await relDB.rel.findHasMany('emittentBackup', 'backsUp', emittent.id))

    },


    async funWithAttachment() {


      const id_overview = uuidv4()

      console.log(id_overview)

      const my_overview = await relDB.rel.save('overview', { id: id_overview })

      const attachment = new Blob(['Is there life on Mars111?'], { type: 'text/plain' });
      console.log(await relDB.rel.putAttachment('overview', my_overview, 'att.txt', attachment, 'text/plain'))
      console.log(await relDB.rel.getAttachment('overview', id_overview, 'att.txt'))

      console.log(await relDB.rel.find('overview', id_overview))
    },

    async funWithBaumRead() {
      console.log('This takes forever?')
      const plants = await relDB.rel.find('plant')
      console.log(plants)
      console.log(await relDB.rel.find('plant',))
      console.log(await relDB.rel.findHasMany('building', 'plant', plants.plants[0].id))

      const buildingsQuery = await relDB.rel.find('building')

      for (const b of buildingsQuery.buildings) {
        const roofsQuery = await relDB.rel.findHasMany('roof', 'building', b.id)
        console.log(roofsQuery.roofs)

        for (const r of roofsQuery.roofs) {
          const emittentsQuery = await relDB.rel.findHasMany('emittent', 'roof', r.id)
          console.log(emittentsQuery.emittents)
        }
      }
      console.log('End')
    },

    async filterWithPouch() {
      const docs = await db.find({
        selector: {
          name: { $regex: /.*50.*/ }, $or: [
            {
              $and: [{
                'ein_punkt_messungen.0': {
                  '$exists': true
                },
                'ein_punkt_messungen.0.auswertung': {
                  '$exists': false
                }
              },
              ]

            }


            ,
            {
              'kamin_messungen.0': {
                '$exists': true
              }
            },
            {
              'drei_punkt_messungen.0': {
                '$exists': true
              }
            },
            {
              'vier_punkt_messungen.0': {
                '$exists': true
              }
            },
            {
              'fuenf_punkt_messungen.0': {
                '$exists': true
              }
            }]
        }
      }
      )

      console.log(docs)

    },
    increment() {
      this.counter++;
    },

    async sendOverview2Backend(file: File) {
      if (false) {
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
      } else {
        const id_overview = uuidv4()

        console.log(id_overview)

        const my_overview = await relDB.rel.save('overview', { id: id_overview })
        if (file != null) {
          // const attachment = new Blob(['Is there life on Mars111?'], { type: 'text/plain' });
          console.log(await relDB.rel.putAttachment('overview', my_overview, 'overview', file, file.type))
          console.log(await relDB.rel.getAttachment('overview', id_overview, 'overview'))

          console.log(await relDB.rel.find('overview', id_overview))
        }
      }
    },

    async deleteOverview(id: number) {
      await api.delete(`/overviews/${id}`)
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
      this.karteMainPage = null
      this.karte2editZuordnung = null
      console.log('Projekt wurde gewechselt')

    },
    showMap(_args: Plant | Roof) {
      this.karteMainPage = _args.map
      this.karteMainPageZuordnung = _args
      this.rectsOnMap = []
      this.pointsOnMap = []

    },
    async init() {
      const storage = useStorage('projects', [{ name: 'X', id: '12' }])
      // console.log('storage', storage.value)
      // storage.value.push({ name: 'Y', id: '99' })
      this.overviews = (await relDB.rel.find('overview')).overviews//api.get('/overviews/').then(response => response.data.results)
      this.messgeraete = await api.get('/messgeraete/').then(response => response.data.results.map((i: any) => mapper.map<MessgeraetApi, Messgeraet>(i, 'MessgeraetApi', 'Messgeraet')))
      // this.messgeraete = messgeraetFactory.buildList(3)
      this.vorlagen = await api.get('/reporttemplate/').then(response => response.data.results.map((i: any) => vorlageFactory.build({ name: i.name, idAtBackend: i.id })))
      // this.plants = plantFactory.buildList(2, { project_id: 1 })

      const r1 = await api.get('/projects/')
      console.log(r1)
      this.projects = r1.data.results.map((i: ProjectApi) => mapper.map<ProjectApi, Projekt>(i, 'ProjectApi', 'Project'))
      this.project = this.projects.length == 0 ? null : this.projects[1]
      /*
      const r2 = await api.get('/werk')
      console.log(r2)
      this.plants = r2.data.results.map((i: Werk) => mapper.map<Werk, Plant>(i, 'Werk', 'Plant'))
      */

      // const r3 = await api.get(`/kataster/?project__id=${this.project?.id}`)
      // console.log(r3)
      // this.plants = r3.data.results.map((i: TreeNodeApi) => mapper.map<TreeNodeApi, Plant>(i, 'TreeNodeApi', 'Plant'))
      this.loadUebersicht()
      console.log(this.plants)
      if (this.developmentMode) {
        this.setEmittentDetailsFromEmittent({
          id: '11419',
          koordinaten: { gk_rechts: 1, gk_hoch: 1 }
        } as Emittent)

      }

    },

    createRevision(args: Emittent, comment: string) {
      api.post(`/revision/${args.id}/`, {
        comment: comment
      }).then(response => response.data)
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

    deleteReversion(args: Emittent) {
      api.patch(`/revision/${args.id}/`).then(response => console.log(response.data))
    },

    async setEmittentDetailsFromEmittent(args: Emittent) {
      if (false) {
        const w_bar = await api.get(`/emittent/details/${args.id}`).then(response => response.data)

        const e_bar = mapper.map<EmittentDetail, EmittentDetails>(w_bar, 'EmittentDetailsAPI', 'EmittentDetails')

        this.emittent = e_bar // emittentDetailsFactory.build({ name: args.name })
        console.log('emittent', this.emittent, args, w_bar)
        this.emittentSource = args
      } else {

        const e = emittentDetailsFactory.build()
        const emittent = (await relDB.rel.find('emittent', args.id)).emittents[0]
        console.log('emittentPouch', emittent)
        const r = mapper.map<PouchEmittent, EmittentDetails>(emittent, 'PouchEmittent', 'EmittentDetails')
        this.emittent = { ...e, ...r, id: args.id } // emittentDetailsFactory.build({ name: args.name })
        if (emittent.attachments?.image) {
          this.emittent.picture = URL.createObjectURL((await relDB.rel.getAttachment('emittent', args.id, 'image')) as Blob)
        }

        console.log('emittent', this.emittent, args, { ...e, ...r, id: args.id })
        this.emittentSource = args

      }
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

      const p_bar = mapper.map<Messgeraet, MessgeraetApi>(arg, 'Messgeraet', 'MessgeraetApi')

      // const p_bar = {
      //   name: 'a1',
      //   hz31_5: 10,
      //   hz63: 11,
      //   hz125: 12,
      //   hz250: 13,
      //   hz500: 14,
      //   hz1000: 15,
      //   hz2000: 16,
      //   hz4000: 17,
      //   hz8000: 18,

      //   format_datetime_filename: 'yyyy-MM-dd', format_datetime_overview: 'yyyy-MM-dd'
      // }
      api.post('/messgeraete/', p_bar).then(res => {
        console.log(res.data)
      })

    },

    updateMessgeraetBackend(arg: Messgeraet) {
      const p_bar = mapper.map<Messgeraet, MessgeraetApi>(arg, 'Messgeraet', 'MessgeraetApi')
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
    async createPlantBackend(arg: Plant) {
      if (false) {
        const p_bar = mapper.map<Plant, Werk>(arg, 'Plant', 'Werk')
        p_bar.project = 6
        api.post('/werk/', p_bar).then(res => {
          console.log(res.data)
          const p_tilde = mapper.map<Werk, Plant>(res.data, 'Werk', 'Plant')
          console.log(p_tilde)
          this.plants.push(p_tilde)
        }).catch(errorHandler)

      } else {
        const p_bar = mapper.map<Plant, PouchPlant>(arg, 'Plant', 'PouchPlant')

        p_bar.id = uuidv4()

        console.log(p_bar)

        const result_plant = await relDB.rel.save('plant', p_bar)

        const p_tilde = mapper.map<PouchPlant, Plant>(p_bar, 'PouchPlant', 'Plant')
        console.log(p_tilde)
        this.plants.push(p_tilde)


      }

    },
    async removePlantBackend(arg: Plant) {
      if (false) {
        api.delete(`/werk/${arg.id}`).then(res => {
          console.log(res.data)
          const idx = this.plants.findIndex(i => i.id == arg.id)
          const n = this.plants.splice(idx, 1)
          console.log('Removed', n)
        }).catch(errorHandler)
      } else {
        const p = await relDB.rel.find('plant', arg.id)

        console.log(await relDB.rel.del('plant', p.plants[0]))
        const idx = this.plants.findIndex(i => i.id == arg.id)
        const n = this.plants.splice(idx, 1)
      }

    },
    updatePlantBackend(arg: Plant) {
      const p_bar = mapper.map<Plant, Werk>(arg, 'Plant', 'Werk')
      api.patch(`/werk/${arg.id}/`, p_bar).then(res => {
        console.log(res.data)
        const idx = this.plants.findIndex(i => i.id == arg.id)
      }).catch(errorHandler)

    },
    async removeBuildingBackend(arg: Building) {
      if (false) {
        api.delete(`/building/${arg.id}`).then(res => {
          console.log(res.data)
          // const idx = this.plants.findIndex(i => i.id == arg.id)
          // const n = this.plants.splice(idx, 1)
          // console.log('Removed', n)
        }).catch(errorHandler)
      }
      const b = await relDB.rel.find('building', arg.id)
      console.log(b)
      console.log(await relDB.rel.del('building', b.buildings[0]))
      const p = this.findPlantById(b.buildings[0].plant)
      const idx = p?.children.findIndex(i => i.id == arg.id)
      if (idx != null && idx != -1) {
        const n = p?.children.splice(idx, 1)
      }

    },
    async removeRoofBackend(arg: Roof) {
      if (false) {
        api.delete(`/roof/${arg.id}`).then(res => {
          console.log(res.data)
          // const idx = this.plants.findIndex(i => i.id == arg.id)
          // const n = this.plants.splice(idx, 1)
          // console.log('Removed', n)
        }).catch(errorHandler)
      } else {
        const b = await relDB.rel.find('roof', arg.id)
        console.log(b)
        console.log(await relDB.rel.del('roof', b.roofs[0]))
        const p = this.findPlantById(b.roofs[0].building)
        const idx = p?.children.findIndex(i => i.id == arg.id)
        if (idx != null && idx != -1) {
          const n = p?.children.splice(idx, 1)
        }
      }

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
      console.log(this.plants, arg)
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

    async createBuildingBackend(arg: Building, parent_id: string) {
      if (false) {
        const p_bar = mapper.map<Building, BuildingApi>(arg, 'Building', 'BuildingApi')
        const parent = this.findPlantById(parent_id)
        // p_bar.plant = parent_id
        console.log(p_bar)
        api.post('/building/', p_bar).then(res => {
          console.log(res.data)
          const p_tilde = mapper.map<BuildingApi, Building>(res.data, 'BuildingApi', 'Building')
          parent?.children.push(p_tilde)
          p_tilde.parent = parent!.id

        }).catch(errorHandler)
      } else {
        const p_bar = mapper.map<Building, PouchBuilding>(arg, 'Building', 'PouchBuilding')
        p_bar.plant = parent_id
        p_bar.id = uuidv4()

        console.log(p_bar)

        const result_plant = await relDB.rel.save('building', p_bar)

        const p_tilde = mapper.map<PouchBuilding, Building>(p_bar, 'PouchBuilding', 'Building')
        console.log(p_tilde)
        const parent = this.findPlantById(parent_id)
        console.log(parent)
        parent?.children.push(p_tilde)


      }
    },

    async loadUebersicht() {
      this.plants = await relDB.rel.find('plant').then(async response => {

        const result: Plant[] = response.plants.map((i: PouchPlant) => mapper.map<PouchPlant, Plant>(i, 'PouchPlant', 'Plant'))
        for (const p of result) {
          const pouchBuildings = (await relDB.rel.findHasMany('building', 'plant', p.id)).buildings
          const buildings = pouchBuildings.map((i: PouchBuilding) => mapper.map<PouchBuilding, Building>(i, 'PouchBuilding', 'Building'))
          p.children = buildings
          for (const b of p.children) {
            const pouchRoofs = (await relDB.rel.findHasMany('roof', 'building', b.id)).roofs
            const roofs = pouchRoofs.map((i: PouchRoof) => mapper.map<PouchRoof, Roof>(i, 'PouchRoof', 'Roof'))
            b.children = roofs
            for (const r of b.children) {
              const pouchEmittents = (await relDB.rel.findHasMany('emittent', 'roof', r.id)).emittents
              const emittents = pouchEmittents.map((i: PouchEmittent) => mapper.map<PouchEmittent, Emittent>(i, 'PouchEmittent', 'Emittent'))
              r.children = emittents

            }
          }
          console.log(p)

        }

        return result
      })

    },
    updateBuildingBackend(arg: Building) {
      const p_bar = mapper.map<Building, BuildingApi>(arg, 'Building', 'BuildingApi')
      api.patch(`/building/${arg.idAtBackend}/`, p_bar).then(res => {
        console.log(res.data)
        // const idx = this.plants.findIndex(i => i.id == arg.id)
      }).catch(errorHandler)

    },
    async createRoofBackend(arg: Roof, parent_id: string) {
      if (false) {
        const p_bar = mapper.map<Roof, RoofApi>(arg, 'Roof', 'RoofApi')
        // p_bar.building = parent_id
        api.post('/roof/', p_bar).then(res => {
          console.log(res.data, arg, parent_id)
          const p_tilde = mapper.map<RoofApi, Roof>(res.data, 'RoofApi', 'Roof')

          const r = this.findBuildingById(`${parent_id}`)
          r?.children.push(p_tilde)
          p_tilde.parent = r!.id
          console.log(p_tilde)
        }).catch(errorHandler)
      } else {
        const p_bar = mapper.map<Roof, PouchRoof>(arg, 'Roof', 'PouchRoof')
        p_bar.building = parent_id
        p_bar.id = uuidv4()

        console.log(p_bar)

        const result_plant = await relDB.rel.save('roof', p_bar)

        const p_tilde = mapper.map<PouchRoof, Roof>(p_bar, 'PouchRoof', 'Roof')
        console.log(p_tilde)
        const parent = this.findBuildingById(parent_id)
        console.log(parent)
        parent?.children.push(p_tilde)
      }
    },
    async createEmittentBackend(arg: Emittent, parent_id: string) {
      if (false) {
        arg.parent = `${parent_id}`
        console.log('Before:', arg)
        const p_bar = mapper.map<Emittent, EmittentApi>(arg, 'Emittent', 'EmittentApi')
        api.post('/emittent/', p_bar).then(res => {
          console.log(res.data)
          const p_tilde = mapper.map<EmittentApi, Emittent>(res.data, 'EmittentApi', 'Emittent')
          const r = this.findRoofById(parent_id)
          p_tilde.parent = r!.id
          r?.children.push(p_tilde)
          console.log(p_tilde)
        }).catch(errorHandler)
      } else {
        const p_bar = mapper.map<Emittent, PouchEmittent>(arg, 'Emittent', 'PouchEmittent')
        p_bar.roof = parent_id
        p_bar.id = uuidv4()

        console.log(p_bar)

        const result_plant = await relDB.rel.save('emittent', p_bar)

        const p_tilde = mapper.map<PouchEmittent, Emittent>(p_bar, 'PouchEmittent', 'Emittent')
        console.log(p_tilde)
        const parent = this.findRoofById(parent_id)
        console.log(parent)
        parent?.children.push(p_tilde)

      }
    },

    updateCorrespondingNonDetailedEmittent(emittent: EmittentDetails) {
      if (this.emittentSource != null) {
        this.emittentSource.name = emittent.name
        this.emittentSource.koordinaten.gk_rechts = emittent.gkrechts
        this.emittentSource.koordinaten.gk_hoch = emittent.gkhoch

      }




    },
    async updateEmittentDetails(e_bar: EmittentDetails, imageFile: File | null) {
      if (this.emittentSource != null) {
        const emittent = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
        console.log(emittent, this.emittentSource)
        const r = mapper.map<EmittentDetails, PouchEmittent>(e_bar, 'EmittentDetails', 'PouchEmittent')

        this.updateCorrespondingNonDetailedEmittent(e_bar)
        if (imageFile != null) {
          await relDB.rel.putAttachment('emittent', { ...r, id: emittent.id, rev: emittent.rev, roof: emittent.roof }, 'image', imageFile, imageFile.type)
        } else {
          await relDB.rel.save('emittent', { ...r, id: emittent.id, attachments: emittent.attachments, rev: emittent.rev, roof: emittent.roof })
        }
        console.log((await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0])
      }
      if (false) {
        this.updateCorrespondingNonDetailedEmittent(e_bar)
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

        // const w_tilde = mapper.map<EmittentDetails, EmittentDetail>(e_bar, 'EmittentDetails', 'EmittentDetailsAPI')


        // // console.log(w_bar, e_bar, w_tilde)
        // delete w_tilde['image']
        // console.log(w_tilde)
        // const response = await api.patch(`/emittent/details/${id}/`, w_tilde).catch(errorHandler)
        // console.log(response)

        // const image = w_tilde['image']
        // if (imageFile != null) {
        //   const formData = new FormData();
        //   // formData.append('upload', f.data, 'testfile.ico');
        //   formData.append('image', imageFile);
        //   const r = await api
        //     .patch(
        //       `/emittent/details/${id}/`,
        //       formData,
        //       {
        //         headers: {
        //           'Content-Type': 'multipart/form-data',
        //         },
        //       }
        //     )
        //   console.log(r.data)
        // }

        // await this.setEmittentDetailsFromEmittent(this.emittentSource!)
      }

    },
    async createKarteDetailsBackend(arg: KarteDetails, imageFile: File | null) {
      console.log('Save map...')
      if (true) {
        const id_overview = uuidv4()

        console.log(id_overview)

        const my_overview = await relDB.rel.save('map', { id: id_overview })
        if (imageFile != null) {
          // const attachment = new Blob(['Is there life on Mars111?'], { type: 'text/plain' });
          console.log(await relDB.rel.putAttachment('map', my_overview, 'image', imageFile, imageFile.type))
          console.log(await relDB.rel.getAttachment('map', id_overview, 'image'))

          console.log(await relDB.rel.find('map', id_overview))
        }

      }
      if (false) {

        // const b_bar = mapper.map<KarteDetails, KarteApi>(arg, 'KarteDetails', 'KarteApi')

        // b_bar.upload = null

        // if (this.karte2editZuordnung != null) {

        //   if (this.karte2editZuordnung?.body == 'werk') {
        //     b_bar.plant_set = [getIdFromString(this.karte2editZuordnung.id)]

        //   } else if (this.karte2editZuordnung?.body == 'dach') {
        //     b_bar.roof_set = [getIdFromString(this.karte2editZuordnung.id)]

        //   }
        // }

        // let req = null
        // const id_karte_details = arg.id.toString()
        // if (id_karte_details.match(/^[a-zA-Z]/)) {
        //   req = await api.post('/map/', b_bar)
        // } else {

        //   req = await api.patch(`/map/${b_bar.id}/`, b_bar)
        // }

        // if (this.karte2editZuordnung?.body == 'werk') {
        //   const r = this.findPlantById(this.karte2editZuordnung.id)
        //   if (r != null)
        //     r.map = this.karte2edit!

        // } else if (this.karte2editZuordnung?.body == 'dach') {
        //   const r = this.findRoofById(this.karte2editZuordnung.id)
        //   if (r != null)
        //     r.map = this.karte2edit!

        // }
        // console.log(req.data)

        // const f = await api.get<Blob>('http://localhost:8080/favicon.ico', {
        //   responseType: 'blob'
        // })

        // if (iamgeFile != null) {
        //   const formData = new FormData();
        //   // formData.append('upload', f.data, 'testfile.ico');
        //   formData.append('upload', iamgeFile, 'testfile.ico');
        //   // formData.append('container', '1')
        //   const r = await api
        //     .patch(
        //       `/map/${req.data.id}/`,
        //       formData,
        //       {
        //         headers: {
        //           'Content-Type': 'multipart/form-data',
        //         },
        //       }
        //     ).catch(errorHandler)
        //   console.log(r)
        // }
      }

    }
  },
});
