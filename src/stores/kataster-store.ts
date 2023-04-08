import { defineStore } from 'pinia';
import { mapper } from 'src/mappings/mapper';
import {
  luftschadstoffeFactory,
  Building, Emittent, EmittentDetails, emittentDetailsFactory,
  KarteDetails, karteDetailsFactory, Messgeraet, messgeraetFactory, Messung, messwertereiheFactory, metainfoFactory, OverviewFile, Plant, plantFactory, PointOnMap, Projekt, RectOnMap, Roof, Vorlage, vorlageFactory, Luftschadstoffe
} from 'src/models/v1';

import { MessgeraetApi, Building as BuildingApi, EmittentDetail, KarteApi, Werk, Roof as RoofApi, Emittent as EmittentApi, Project as ProjectApi, TreeNodeApi } from 'src/models/api'

import { api } from 'src/boot/axios';
import { errorHandler } from 'src/utility/errorHandling';

import { v4 as uuidv4 } from 'uuid';

import PouchDB from 'pouchdb-browser';
import find from 'pouchdb-find'
import rel from 'relational-pouch';



import werkJSON from 'C:/Repos/django-server/mydjangoserver/kataster/scripts/mannheim/werk.json'
import buildingJSON from 'C:/Repos/django-server/mydjangoserver/kataster/scripts/mannheim/gebaeude.json'
import roofJSON from 'C:/Repos/django-server/mydjangoserver/kataster/scripts/mannheim/roof.json'
import emittentJSON from 'C:/Repos/django-server/mydjangoserver/kataster/scripts/mannheim/emittent.json'
import mapJSON from 'C:/Repos/django-server/mydjangoserver/kataster/scripts/mannheim/map.json'



PouchDB.plugin(find);
PouchDB.plugin(rel);


import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears
} from 'quasar'


const masterDb = new PouchDB('main')


const relMasterDb = masterDb.setSchema([
  { singular: 'project', plural: 'projects' },
  { singular: 'template', plural: 'templates' }
])

function setUpDb(name: string) {
  console.log(name)
  const db = new PouchDB(name); // mydb6
  const result = db.setSchema([
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
      relations: {
        'roof': { belongsTo: 'roof' },
        'plant': { belongsTo: 'plant' },
      }
    },

    {
      singular: 'messgeraet',
      plural: 'messgeraete',
    },

    {
      singular: 'article',
      plural: 'articles',
    },



  ]);

  return result


}
let relDB: PouchDB.RelDatabase

import * as _ from 'lodash'
import { PouchBuilding, PouchEmittent, PouchMessgeraet, PouchPlant, PouchProject, PouchRoof } from 'src/models/pouch-api';
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
    getDb: () => relDB,
    getMasterDb: () => relMasterDb
  },
  actions: {
    async replicateDatabase() {
      if (this.project) {
        console.log('started syncing')
        //console.log(await relDB.replicate.to(`http://admin:password@127.0.0.1:5984/${this.project?.dbName}`));
        console.log(await relDB.sync(`http://admin:password@127.0.0.1:5984/${this.project?.dbName}`));

      }
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
      relDB.destroy().then(res => console.log(res))
    },

    async funWithPouch() {
      const docs = await relDB.allDocs({ include_docs: true })
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
                    { ...response.data, id: uuidv4(), discriminator: 'emittent', roof: id_roof }
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


    async loadJson() {
      console.log(werkJSON)
      for (const p of werkJSON) {

        await relDB.rel.save('plant', p)
      }
      for (const b of buildingJSON) {
        await relDB.rel.save('building', b)
      }
      for (const r of roofJSON) {
        await relDB.rel.save('roof', r)
        console.log(r)
      }
      for (const e of emittentJSON) {
        const mappedEmittent = mapper.map(e, 'EmittentDetails', 'PouchEmittent')
        await relDB.rel.save('emittent', e)
        console.log('mapped', mappedEmittent, 'old', e)
      }
      for (const m of mapJSON) {
        await relDB.rel.save('map', m)
        console.log(m)
      }
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
      const docs = await relDB.find({
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

    async sendOverview2Backend(file: File) {

      const id_overview = uuidv4()

      console.log(id_overview)


      if (file != null) {
        // const attachment = new Blob(['Is there life on Mars111?'], { type: 'text/plain' });
        const my_overview = await relDB.rel.save('overview', { id: id_overview, filename: file.name, lastModfied: file.lastModified })
        console.log(await relDB.rel.putAttachment('overview', my_overview, 'overview', file, file.type))
        console.log(await relDB.rel.getAttachment('overview', id_overview, 'overview'))

        const overview_doc = await relDB.rel.find('overview', id_overview)

        console.log(overview_doc)
        this.overviews.push(overview_doc.overviews[0])
      }

    },

    async removeProject(arg: Projekt) {
      const project = (await relMasterDb.rel.find('project', arg.id)).projects[0]
      await relMasterDb.rel.del('project', project)
      const db = new PouchDB(project.dbName)
      await db.destroy()
      console.log('Removed')
      const idx = this.projects.findIndex(i => i.id === arg.id)
      this.projects.splice(idx, 1)
    },

    async deleteOverview(id: string) {
      const ov_doc = await relDB.rel.find('overview', id)
      console.log(ov_doc.overviews[0])
      const myOverview = ov_doc.overviews[0]
      const del = await relDB.rel.del('overview', myOverview)
      console.log(del)

      const idx = this.overviews.findIndex(i => i.id == id)
      this.overviews.splice(idx, 1)
    },
    async changeProject(arg: Projekt) {
      this.project = arg
      console.log(arg)
      relDB = setUpDb(this.project!.dbName)

      await this.loadUebersicht()

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
    async showMap(_args: Plant | Roof) {
      this.karteMainPage = _args.map
      this.karteMainPageZuordnung = _args
      this.rectsOnMap = []
      this.pointsOnMap = []

      const map = (await relDB.rel.find('map', _args.map.id)).maps[0]
      if (map.attachments?.image) {
        this.karteMainPage!.url = URL.createObjectURL((await relDB.rel.getAttachment('map', _args.map.id, 'image')) as Blob)
      }
      console.log('Map', map)



    },
    async init() {
      // console.log('storage', storage.value)
      // storage.value.push({ name: 'Y', id: '99' })
      this.projects = (await relMasterDb.rel.find('project')).projects.map((i: any) => mapper.map<PouchProject, Projekt>(i, 'PouchProject', 'Projekt'))
      console.log((await relMasterDb.rel.find('project')).projects)
      if (this.projects.length) {
        this.project = this.projects[0]
        relDB = setUpDb(this.project?.dbName)

        await this.loadUebersicht()
        console.log('Werke', this.plants, 'Templates', this.vorlagen)
        // this.setEmittentDetailsFromEmittent((await relDB.rel.find('emittent')).emittents[0])

      }

    },

    async createRevision(args: Emittent, comment: string) {
      const current = (await relDB.rel.find('emittent', args.id)).emittents[0]
      current.backsUp = args.id
      current.id = uuidv4()
      delete current.rev
      current.discriminator = 'emittentBackup'
      current.comment = comment
      current.backupDate = (new Date()).getDate()
      await relDB.rel.save('emittentBackup', current)

    },


    async readRevisions(args: Emittent) {
      // this.currentArchive = (await relDB.rel.find('emittentBackup')).emittentsBackups
      // const docs = await relDB.find({
      //   selector: {
      //     // 'data.discriminator': 'emittentsBackup',
      //     // 'data.backsUp': args.id
      //   }
      // })
      // const docs2 = await relDB.find({
      //   selector: {
      //     'data.discriminator': 'emittentBackup',
      //     'data.backsUp': args.id
      //   }
      // })
      // const docs3 = await relDB.rel.parseRelDocs('emittentBackup', docs2.docs)
      // console.log(docs3.emittentsBackups)
      // console.log(docs2)
      // console.log(docs)
      // this.currentArchive = docs3.emittentsBackups

      const doc = await relDB.get(relDB.rel.makeDocID({ type: 'emittent', 'id': args.id }), { revs_info: true })
      if (doc != null && doc._revs_info && doc._revs_info?.length) {
        const lastVersion = await relDB.get(relDB.rel.makeDocID({ type: 'emittent', 'id': args.id }), { rev: doc._revs_info[1].rev })
        console.log(doc, lastVersion)
      }

      /*

      api.get(`/revision/${args.id}/`).then(response => {
        console.log(response.data)
        this.currentArchive = response.data
      })
      */

    },

    revertRevisions(backup: EmittentDetails) {
      // const doc = (await relDB.rel.find('emittentBackup', id)).emittentBackup[0]
      // const del = (await relDB.rel.del('emittentBackup', doc))

      console.log('bachkup', backup)




    },

    async deleteReversion(args: Emittent) {
      // const doc = (await relDB.rel.find('emittentBackup', id)).emittentBackup[0]
      // const del = (await relDB.rel.del('emittentBackup', doc))
    },

    async setEmittentDetailsFromEmittent(args: Emittent) {

      const e = emittentDetailsFactory.build()
      const emittent = (await relDB.rel.find('emittent', args.id)).emittents[0]
      console.log('emittentPouch', emittent)
      const r = mapper.map<PouchEmittent, EmittentDetails>(emittent, 'PouchEmittent', 'EmittentDetails')
      this.emittent = { ...e, ...r, id: args.id } // emittentDetailsFactory.build({ name: args.name })
      if (emittent.attachments?.image) {
        this.emittent.picture = URL.createObjectURL((await relDB.rel.getAttachment('emittent', args.id, 'image')) as Blob)
      }

      console.log('emittent', this.emittent, args, { ...e, ...r, id: args.id }, 'ausDb', emittent)
      this.emittentSource = args


    },

    showReversion(arg: EmittentDetail) {
      console.log(arg)
      // const e_bar = mapper.map<EmittentDetail, EmittentDetails>(arg, 'EmittentDetailsAPI', 'EmittentDetails')
      // this.emittent = e_bar // emittentDetailsFactory.build({ name: args.name })
    },



    async createExcelTemplateBackend(arg: Vorlage) {
      const v_bar = {
        name: 'XY',
        id: uuidv4()
      }



      relMasterDb.rel.save('template', v_bar)

      this.vorlagen.push(arg)
    },

    async updateExcelTemplateBackend(arg: Vorlage) {
      const v_bar = {
        name: arg.name,

      }

      const fromDb = await relMasterDb.rel.find('template', arg.id)
      relMasterDb.rel.save('template', { ...arg, id: fromDb.templates[0].id, rev: fromDb.templates[0].rev })
    },

    async createMessgeraetBackend(arg: Messgeraet) {
      const m = mapper.map<Messgeraet, PouchMessgeraet>(arg, 'Messgeraet', 'PouchMessgeraet')

      const r = await relDB.rel.save('messgeraet', m)

      console.log(r)

      this.messgeraete.push(arg)


    },

    async updateMessgeraetBackend(arg: Messgeraet) {
      const m = mapper.map<Messgeraet, PouchMessgeraet>(arg, 'Messgeraet', 'PouchMessgeraet')

      const pm = (await relDB.rel.find('messgeraet', arg.id)).messgeraete[0]
      const r = await relDB.rel.save('messgeraet', { ...m, id: pm.id, rev: pm.rev })

      console.log(r)

    },

    async createProjectBackend(arg: Projekt) {
      const docs = await relMasterDb.allDocs()
      console.log(docs)
      const m = mapper.map<Projekt, PouchProject>(arg, 'Projekt', 'PouchProject')
      const m_no_id = m as any
      delete m_no_id.id
      relMasterDb.rel.save('project', m_no_id)
      console.log(arg, m)
      this.projects.push(arg)

    },
    async updateProjectBackend(arg: Projekt) {
      const m = mapper.map<Projekt, PouchProject>(arg, 'Projekt', 'PouchProject')
      const doc = (await relMasterDb.rel.find('project', m.id)).projects[0]
      console.log(doc)
      await relMasterDb.rel.save('project', {
        ...m, id: doc.id, rev: doc.rev
      })

      /*
      const current_id = arg.id
      const p_bar = mapper.map<Projekt, ProjectApi>(arg, 'Project', 'ProjectApi')

      api.patch(`/projects/${current_id}/`, p_bar).then(res => {
        console.log(res.data)
        const p_tilde = mapper.map<ProjectApi, Projekt>(res.data, 'ProjectApi', 'Project')
        console.log(p_tilde)
        const idx = this.projects.findIndex(arg => arg.id == current_id)
        this.projects.splice(idx, 1, p_tilde)
      }).catch(errorHandler)
      */
    },
    async createPlantBackend(arg: Plant) {

      const p_bar = mapper.map<Plant, PouchPlant>(arg, 'Plant', 'PouchPlant')

      p_bar.id = uuidv4()

      console.log(p_bar)

      const result_plant = await relDB.rel.save('plant', p_bar)

      const p_tilde = mapper.map<PouchPlant, Plant>(p_bar, 'PouchPlant', 'Plant')
      console.log(p_tilde)
      this.plants.push(p_tilde)




    },
    async removePlantBackend(arg: Plant) {

      const p = await relDB.rel.find('plant', arg.id)

      console.log(await relDB.rel.del('plant', p.plants[0]))
      const idx = this.plants.findIndex(i => i.id == arg.id)
      const n = this.plants.splice(idx, 1)


    },
    async updatePlantBackend(arg: Plant) {
      const p = await relDB.rel.find('plant', arg.id)

      console.log(await relDB.rel.save('plant', { ...p.plants[0], name: arg.name }))


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
    async removeEmittentBackend(arg: Emittent) {
      const p = await relDB.rel.find('emittent', arg.id)

      await relDB.rel.del('emittent', p.emittents[0])
      const roof = this.findRoofById(p.emittents[0].roof)
      const idx = roof?.children.findIndex(i => i.id == p.emittents[0].id)
      if (idx != null && idx != -1) {
        const n = roof?.children.splice(idx, 1)
      }

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
      Loading.show({
        spinner: QSpinnerGears,
        // other props
      })
      this.plants = await relDB.rel.find('plant').then(async response => {
        console.log(response)
        const result: Plant[] = response.plants.map((i: PouchPlant) => mapper.map<PouchPlant, Plant>(i, 'PouchPlant', 'Plant'))
        for (const p of result) {
          const pouchMapsPlants = (await relDB.rel.findHasMany('map', 'plant', p.id)).maps
          console.log('Maps-Werke', pouchMapsPlants)
          p.map = pouchMapsPlants.length ? pouchMapsPlants[0] : null
          const pouchBuildings = (await relDB.rel.findHasMany('building', 'plant', p.id)).buildings
          const buildings = pouchBuildings.map((i: PouchBuilding) => mapper.map<PouchBuilding, Building>(i, 'PouchBuilding', 'Building'))
          p.children = buildings
          for (const b of p.children) {
            const pouchRoofs = (await relDB.rel.findHasMany('roof', 'building', b.id)).roofs
            const roofs = pouchRoofs.map((i: PouchRoof) => mapper.map<PouchRoof, Roof>(i, 'PouchRoof', 'Roof'))
            b.children = roofs
            for (const r of b.children) {
              const pouchMapsRoofs = (await relDB.rel.findHasMany('map', 'roof', r.id)).maps
              console.log('Maps-Werke', pouchMapsRoofs)
              r.map = pouchMapsRoofs.length ? pouchMapsRoofs[0] : null
              const pouchEmittents = (await relDB.rel.findHasMany('emittent', 'roof', r.id)).emittents
              const emittents = pouchEmittents.map((i: PouchEmittent) => mapper.map<PouchEmittent, Emittent>(i, 'PouchEmittent', 'Emittent'))
              r.children = emittents

            }
          }
          console.log(p)

        }


        return result
      })

      this.overviews = (await relDB.rel.find('overview')).overviews//api.get('/overviews/').then(response => response.data.results)

      console.log('Overviews', this.overviews)

      this.messgeraete = (await relDB.rel.find('messgeraet')).messgeraete.map((i: any) => mapper.map<PouchMessgeraet, Messgeraet>(i, 'PouchMessgeraet', 'Messgeraet'))

      console.log('Messgeräte', this.messgeraete)

      this.vorlagen = (await relMasterDb.rel.find('template')).templates
      Loading.hide()

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

        console.log('arg:', arg, 'mapped:', p_bar)

        const result_plant = await relDB.rel.save('emittent', p_bar)

        const p_tilde = mapper.map<PouchEmittent, Emittent>(p_bar, 'PouchEmittent', 'Emittent')
        console.log('Mapped after save', p_tilde)
        const parent = this.findRoofById(parent_id)
        console.log(parent)
        parent?.children.push(p_tilde)

      }
    },

    updateCorrespondingNonDetailedEmittent(emittent: EmittentDetails) {
      console.log(this.emittentSource)
      if (this.emittentSource != null) {
        this.emittentSource.name = emittent.name
        this.emittentSource.koordinaten.gk_rechts = emittent.gkrechts
        this.emittentSource.koordinaten.gk_hoch = emittent.gkhoch

      }




    },
    async updateEmittentDetails(e_bar: EmittentDetails, imageFile: File | null) {
      if (this.emittentSource != null) {
        const emittent = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
        console.log('Aus db:', emittent, 'Original', this.emittentSource, 'Modified', e_bar)
        const r = mapper.map<EmittentDetails, PouchEmittent>(e_bar, 'EmittentDetails', 'PouchEmittent')

        this.updateCorrespondingNonDetailedEmittent(e_bar)
        if (imageFile != null) {
          await relDB.rel.putAttachment('emittent', { ...r, id: emittent.id, rev: emittent.rev, roof: emittent.roof }, 'image', imageFile, imageFile.type)
        } else {
          await relDB.rel.save('emittent', { ...r, id: emittent.id, attachments: emittent.attachments, rev: emittent.rev, roof: emittent.roof })
        }
        console.log('Nach save', (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0])
      }


    },

    async saveLuftschadstoffe(luftschadstoffe: Luftschadstoffe) {
      console.log('Pushing this data:', luftschadstoffe)
      if (this.emittentSource?.id != null) {
        const emittent = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
        // const emittentPlain = (await relDB.get(this.emittentSource.id))
        console.log('Aus db:', emittent, 'Original', this.emittentSource, 'Plain')
        console.log(luftschadstoffe.messungen[0], emittent.luftschadstoffe.messungen[0], _.isEqual(luftschadstoffe.messungen[0], emittent.luftschadstoffe.messungen[0]))
        console.log('Intersection', _.intersectionWith(emittent.luftschadstoffe.messungen, luftschadstoffe.messungen, _.isEqual))

        emittent.luftschadstoffe = luftschadstoffe


        await relDB.rel.save('emittent', { ...emittent, id: emittent.id, rev: emittent.rev, })
        console.log('Nach 1. save')
        /*
        if (formData != null) {
          const afterSave = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
          await relDB.rel.putAttachment('emittent', { id: afterSave.id, rev: afterSave.rev }, `ls_${luftschadstoffmessung.id}`, formData, formData.type)
        } else {
        }
        */
        console.log('Nach save', (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0])
      }
    },

    async saveLuftschadstoffMessung(luftschadstoffmessung: any, formData: File | null) {
      console.log('Pushing this data:', formData)
      if (this.emittentSource?.id != null) {
        const emittent = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
        // const emittentPlain = (await relDB.get(this.emittentSource.id))
        console.log('Aus db:', emittent, 'Original', this.emittentSource, 'Plain')
        emittent.luftschadstoffe.messungen = [luftschadstoffmessung]
        emittent.luftschadstoffe.genehmigungen = []
        await relDB.rel.save('emittent', { ...emittent, id: emittent.id, rev: emittent.rev, })
        console.log('Nach 1. save')
        if (formData != null) {
          const afterSave = (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0]
          await relDB.rel.putAttachment('emittent', { id: afterSave.id, rev: afterSave.rev }, `ls_${luftschadstoffmessung.id}`, formData, formData.type)
        } else {
        }
        console.log('Nach save', (await relDB.rel.find('emittent', this.emittentSource.id)).emittents[0])
      }
    },

    async runQueryOnEmittents(args: any, conditionsOnRoof: any, conditionsOnBuilding: any, conditionsOnPlant: any) {
      /*
      console.log('Query', args)
      if ( Object.keys(conditionsOnPlant).length) {
        const plants = await relDB.find({
          selector: {
            // 'data.plant': { '$exists': true },
            'data.name': 'VBau'
          }
        })
      }

      if (Object.keys(conditionsOnBuilding).length  || Object.keys(conditionsOnPlant).length)
      const buildings = await relDB.find({
        selector: {
          'data.plant': { '$exists': true },
          'data.name': '54'
        }
      })

      if (Object.keys(conditionsOnRoof).length || Object.keys(conditionsOnBuilding).length || Object.keys(conditionsOnPlant).length)

      console.log(roofs, buildings)
      */
      console.log('Query on Plants', conditionsOnPlant)
      const mergedQueryPlant = Object.keys(conditionsOnPlant).length ? { ...conditionsOnPlant } : {}
      const plants = await relDB.find({
        selector: {
          'data.discriminator': 'plant',
          ...mergedQueryPlant,
        }
      })
      console.log('Plants', plants)


      const mergedQueryBuilding = Object.keys(conditionsOnPlant).length ?
        { 'data.plant': { '$in': plants.docs.map(i => relDB.rel.parseDocID(i._id).id), ...conditionsOnBuilding } } : { ...conditionsOnBuilding }


      const buildings = await relDB.find({
        selector: {
          'data.plant': { '$exists': true },
          // 'data.name': '54',
          ...mergedQueryBuilding
        }
      })
      const mergedQuery = Object.keys(conditionsOnBuilding).length || Object.keys(conditionsOnPlant).length ?
        { 'data.building': { '$in': buildings.docs.map(i => relDB.rel.parseDocID(i._id).id), ...conditionsOnRoof } } : { ...conditionsOnRoof }

      const roofs = await relDB.find({
        selector: {
          'data.building': { '$exists': true },
          // 'data.name': '0',
          ...mergedQuery
        }
      })

      console.log('Found roofs', roofs)

      const condition2merge = {
        'data.roof': { '$in': roofs.docs.map(i => relDB.rel.parseDocID(i._id).id) }

      }

      const queryOnEmittents = {
        selector: {
          'data.discriminator': 'emittent',
          ...condition2merge
          ,
          ...args
        }
      }
      const docs = await relDB.find(queryOnEmittents)

      console.log('Query-Results', docs, queryOnEmittents)
      const results = await relDB.rel.parseRelDocs('emittent', docs.docs)
      console.log(results)
      return results.emittents

    },
    async getOverviewfile(id: string) {
      const result = await relDB.rel.getAttachment('overview', id, 'overview')
      console.log(result)
      return result
    },

    async createKarteDetailsBackend(arg: KarteDetails, imageFile: File | null) {
      console.log('Save map...')
      if (true) {
        console.log('Args', arg)
        const mapInDb = await relDB.rel.find('map', arg.id)
        if (mapInDb.maps.length) {
          console.log('Update Map')

        } else {
          console.log('Create Map')
          const id_overview = uuidv4()
          console.log(id_overview)
          console.log(arg.zuordnung, this.karte2editZuordnung)
          let correspondingPlantId = null
          let correspondingRoofId = null

          if (this.karte2editZuordnung?.body == 'werk') {
            correspondingPlantId = this.karte2editZuordnung?.id

          } else if (this.karte2editZuordnung?.body == 'dach') {
            correspondingRoofId = this.karte2editZuordnung?.id


          }
          const karte = await relDB.rel.save('map', { ...arg, id: id_overview, plant: correspondingPlantId, roof: correspondingRoofId })
          console.log('Karte-Metadata saved...')
          if (imageFile != null) {
            console.log(await relDB.rel.putAttachment('map', karte, 'image', imageFile, imageFile.type))
            console.log('Karte-Image saved...')
            console.log(await relDB.rel.getAttachment('map', id_overview, 'image'))

            console.log(await relDB.rel.find('map', id_overview))
          }
        }




      }


    }
  },
});
