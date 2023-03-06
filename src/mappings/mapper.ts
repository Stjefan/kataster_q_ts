import { createMap, createMapper, forMember, mapFrom, mapWith } from '@automapper/core';
import { afterMap } from '@automapper/core/lib/mapping-configurations/after-map';

import { PojosMetadataMap, pojos } from '@automapper/pojos';
import { PouchAuswertung, PouchAuswertungspegelreihe, PouchBuilding, PouchEmittent, PouchGeometrieEmittent, PouchGeometrieMessung, PouchKoordinaten, PouchKoordinatenHoehe, PouchMap, PouchMessgeraet, PouchMessposition, PouchMesspunktAnAnlage, PouchMessung, PouchMetainfo, PouchPegelreihe, PouchPlant, PouchProject, PouchRoof } from 'src/models/pouch-api';
import {
  Pegelreihe, MesswertereiheDTO,
  MesspositionEditViewModel,
  messwertereiheFactory, Messung, geometrieEmittentFactory, geometrieMessungFactory,
  Plant,
  Building,
  Roof,
  Emittent,
  EmittentDetails,
  MesspunktAnAnlage,
  GeometrieEmittent,
  GeometrieMessung,
  AuswertungDefault,
  KarteDetails,
  Georeferenzierung,
  Georeferenzierungspunkt,
  Koordinaten,
  Metainfo,
  Projekt,
  metainfoFactory,
  Auswertungspegelreihe,
  Messgeraet,
  Luftschadstoffe,
  LuftschadstoffMessung,
  LuftschadstoffGenehmigung,
  luftschadstoffeFactory
} from 'src/models/v1';

import {
  MessgeraetApi,
  PegelreiheAuswertung,
  TreeNodeApi,
  Project as ProjectApi,
  Emittent as EmittentApi,
  Roof as RoofApi,
  Georeferenzierung as GeoreferenzierungApi, Referenzierungspunkt, Koordinaten as KoordinatenApi,
  Pegelreihe as PegelreiheAPI, Werk, EinPunktMessung, DreiPunktMessung, KoordinatenHoehe, GeometrieEmittent as GeometrieEmittentAPI, GeometrieMessung as GeometrieMessungAPI,
  Messposition as MesspositionAPI, EinPunktAuswertung, MesspositionPegelreiheSerializerV2, EmittentDetail, Metainfo as MetainfoApi, VierPunktMessung, FuenfPunktMessung, Building as BuildingAPI, Roof as RoofAPI, KarteApi, KaminMessung,
} from '../models/api'



export function createUserMetadata() {


  PojosMetadataMap.create<Pegelreihe>('Pegelreihe', {
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number
  });


  PojosMetadataMap.create<PegelreiheAPI>('PegelreiheAPI', {
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number
  })

  PojosMetadataMap.create<MetainfoApi>('MetainfoAPI', {
    id: Number
  })

  PojosMetadataMap.create<MesspunktAnAnlage>('MesspunktAnAnlage', {
    fremdpegel: 'Pegelreihe',
    gesamtpegel: 'Pegelreihe',

    metainfoFremdpegel: 'Metainfo',
    metainfoGesamtpegel: 'Metainfo',
    id: String,

    fremdpegelVorhanden: Boolean
  })


  PojosMetadataMap.create<MesspositionEditViewModel>('MesspositionEditViewModel', {
    // messwertereihen: ''
    id: String,
    messwertereihen: 'MesspunktAnAnlage', // 'MesswertreiheDiscriminator'
  })

  PojosMetadataMap.create<MesspositionAPI>('MesspositionAPI', {
    id: String,
    messpositionpegelreihe_set: 'MesspositionPegelreiheSerializerV2'

  })


  PojosMetadataMap.create<MesspositionPegelreiheSerializerV2>('MesspositionPegelreiheSerializerV2', {
    id: String,
    fremdpegel: 'PegelreiheAPI',
    // metainfoFremdpegel: String,
    gesamtpegel: 'PegelreiheAPI',
  })

  PojosMetadataMap.create<Werk>('Werk', {
    id: Number,
    name: String
  })

  PojosMetadataMap.create<Plant>('Plant', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<Messung>('Messung', {
    id: String,
    datum: String,
    type: String,
    messverfahren: String,
    messpositionen: 'MesspositionEditViewModel',
    geometrie_emittent: 'GeometrieEmittent',
    geometrie_messung: 'GeometrieMessung',
    auswertung: 'AuswertungDefault',

  })


  PojosMetadataMap.create<EinPunktAuswertung>('EinPunktAuswertungAPI', {
    id: String,
    lwa: 'PegelreiheAuswertung',
    lwlin: 'PegelreiheAuswertung',
    korrekturwert_1: Number,
    anlagenpegel_1: 'PegelreiheAPI'
  })

  PojosMetadataMap.create<PegelreiheAuswertung>('PegelreiheAuswertung', {
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number,
    summiert: Number
  })

  PojosMetadataMap.create<Auswertungspegelreihe & Pegelreihe>('Auswertungspegelreihe', {
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number,
    summiert: Number
  })

  PojosMetadataMap.create<EinPunktMessung>('EinPunktMessungAPI', {
    id: Number,
    messdatum: Date,
    typ: String,
    messposition_1: 'MesspositionAPI',
    auswertung: 'EinPunktAuswertungAPI',
    messung_geometrie: 'GeometrieMessungAPI',
    emittent_geometrie: 'GeometrieEmittentAPI'

  })

  PojosMetadataMap.create<DreiPunktMessung>('DreiPunktMessungAPI', {
    id: Number,
    messdatum: Date,
    typ: String

  })

  PojosMetadataMap.create<VierPunktMessung>('VierPunktMessungAPI', {
    id: Number,
    messdatum: Date,
    typ: String

  })

  PojosMetadataMap.create<FuenfPunktMessung>('FuenfPunktMessungAPI', {
    id: Number,
    messdatum: Date,
    typ: String

  })

  PojosMetadataMap.create<GeometrieEmittent>('GeometrieEmittent', {
    id: String,
    geo1: Number,
    geo2: Number,
    geo3: Number,
    geo4: Number
  })

  PojosMetadataMap.create<GeometrieEmittentAPI>('GeometrieEmittentAPI', {
    id: String,
    geo_1: Number
  })

  PojosMetadataMap.create<KoordinatenHoehe>('KoordinatenHoeheAPI', {
    id: String,
    gkhoch: Number,
    gkrechts: Number,
    hoehe: Number
  })

  PojosMetadataMap.create<KoordinatenApi>('KoordinatenAPI', {
    id: String,
    gk_hoch: Number,
    gk_rechts: Number,
  })

  PojosMetadataMap.create<Koordinaten>('Koordinaten', {
    id: String,
    gk_hoch: Number,
    gk_rechts: Number,
  })



  PojosMetadataMap.create<EmittentDetail>('EmittentDetailsAPI', {
    id: Number,
    name: String,
    kostenstelle: String,
    bearbeiter: String,
    image: String,
    anlage: String,
    bemerkung: String,
    liegt_an_fassade: Boolean,
    fuer_messung_vormerken: Boolean,
    in_betrieb: Boolean,
    lage: 'KoordinatenHoeheAPI',
    messinstitut: String,
    // ein_punkt_messungen: 'EinPunktMessungAPI',

  })

  PojosMetadataMap.create<EmittentDetails>('EmittentDetails', {
    id: String,
    name: String,
    kostenstelle: String,
    anlage: String,
    bearbeiter: String,
    picture: String,
    messinstitut: String,
    gkrechts: Number,
    gkhoch: Number,
    hoehe: Number,
    liegt_an_fassade: Boolean,
    fuer_messung_vormerken: Boolean,
    in_betrieb: Boolean,
    bemerkung: String,
    abteilung: String,
    luftschadstoffe: 'Luftschadstoffe'
  })

  PojosMetadataMap.create<PouchEmittent>('PouchEmittent', {
    id: String,
    name: String,
    kostenstelle: String,
    anlage: String,
    bearbeiter: String,
    abteilung: String,
    picture: String,
    messinstitut: String,
    liegtAnFassade: Boolean,
    fuerMessungVormerken: Boolean,
    inBetrieb: Boolean,
    bemerkung: String,
    luftschadstoffe: 'Luftschadstoffe'
    // lage: 'PouchKoordinatenHoehe'
  })

  PojosMetadataMap.create<GeoreferenzierungApi>('GeoreferenzierungApi', {
    id: String,
    referenzierungspunkt_set: ['ReferenzierungspunktApi'],
    lower_left: 'KoordinatenApi',
    lower_right: 'KoordinatenApi',
    upper_right: 'KoordinatenApi',
    upper_left: 'KoordinatenApi',
    x00: Number,
    x01: Number,
    x02: Number,
    x10: Number,
    x11: Number,
    x12: Number
  }),

    PojosMetadataMap.create<Luftschadstoffe>('Luftschadstoffe', {
      messungen: ['Luftschadstoffmessung'],
      genehmigungen: ['Luftschadstoffgenehmigung']
    })

  PojosMetadataMap.create<LuftschadstoffMessung>('Luftschadstoffmessung', {
    id: String,
  })

  PojosMetadataMap.create<LuftschadstoffGenehmigung>('Luftschadstoffgenehmigung', {

  })

  PojosMetadataMap.create<Georeferenzierung>('Georeferenzierung', {
    id: String,
    lower_left: 'Koordinaten',
    lower_right: 'Koordinaten',
    upper_right: 'Koordinaten',
    upper_left: 'Koordinaten',
    x00: Number,
    x01: Number,
    x02: Number,
    x10: Number,
    x11: Number,
    x12: Number,
    referenzierungspunkt_set: ['Georeferenzierungspunkt']
  })

  PojosMetadataMap.create<Referenzierungspunkt>('ReferenzierungspunktApi', {

    id: String
  })

  PojosMetadataMap.create<KarteApi>('KarteApi', {
    id: String,
    georeferenzierung: 'GeoreferenzierungApi'
  })

  PojosMetadataMap.create<KarteDetails>('KarteDetails', {
    id: String,
    georeferenzierung: 'Georeferenzierung'
  })

  PojosMetadataMap.create<BuildingAPI>('BuildingApi', {
    id: String,
    name: String,
  })

  PojosMetadataMap.create<Building>('Building', {
    id: String,
    name: String,
  })

  PojosMetadataMap.create<EmittentApi>('EmittentApi', {
    id: String,
    name: String,
  })

  PojosMetadataMap.create<Emittent>('Emittent', {
    id: String,
    name: String,
  })

  PojosMetadataMap.create<RoofApi>('RoofApi', {
    name: String,
  })

  PojosMetadataMap.create<Roof>('Roof', {
    name: String,
  })

  PojosMetadataMap.create<Messgeraet>('Messgeraet', {
    name: String,
    id: String,
    hz31_5: Number,
    hz63: Number, hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number,
  })

  PojosMetadataMap.create<PouchMessgeraet>('PouchMessgeraet', {
    name: String,
    id: String,
    hz31_5: Number,
    hz63: Number, hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number,
  })

  PojosMetadataMap.create<PouchMessung>('PouchMessung', {
    datum: Number,
    id: String,
    geometrie_emittent: 'PouchGeometrieEmittent',
    geometrie_messung: 'PouchGeometrieMessung',
    messpositionen: 'PouchMessposition',
    auswertung: 'PouchAuswertung',
    type: String,
    messverfahren: String
  })

  PojosMetadataMap.create<GeometrieMessung>('GeometrieMessung', {
    geoh: Number,
    geoxy: Number,
    k2a: Number,
    komega: Number
  })

  PojosMetadataMap.create<PouchGeometrieMessung>('PouchGeometrieMessung', {
    geoh: Number,
    geoxy: Number,
    k2a: Number,
    komega: Number
  })

  PojosMetadataMap.create<PouchGeometrieEmittent>('PouchGeometrieEmittent', {
    geo1: Number,
    geo2: Number,
    geo3: Number,
    geo4: Number
  })

  PojosMetadataMap.create<PouchMessposition>('PouchMessposition', {
    id: String,
    messwertereihen: 'PouchMesspunktAnAnlage'
  })

  PojosMetadataMap.create<AuswertungDefault>('AuswertungDefault', {
    id: String,
    lwa: 'Auswertungspegelreihe',
    lwlin: 'Auswertungspegelreihe',
    mittelungspegel_gesamt: ['Pegelreihe'],
    mittelungspegel_fremd: ['Pegelreihe'],
    anlagenpegel: ['Pegelreihe'],
    korrekturwerte: [Number]
  })

  PojosMetadataMap.create<PouchAuswertung>('PouchAuswertung', {
    id: String,
    lwa: 'PouchAuswertungspegelreihe',
    lwlin: 'PouchAuswertungspegelreihe',
    mittelungspegel_gesamt: ['PouchPegelreihe'],
    mittelungspegel_fremd: ['PouchPegelreihe'],
    anlagenpegel: ['PouchPegelreihe'],
    korrekturwerte: [Number]
  })




  PojosMetadataMap.create<MesspunktAnAnlage>('PouchMesspunktAnAnlage', {
    fremdpegel: 'PouchPegelreihe',
    gesamtpegel: 'PouchPegelreihe',

    metainfoFremdpegel: 'PouchMetainfo',
    metainfoGesamtpegel: 'PouchMetainfo',
    id: String,

    fremdpegelVorhanden: Boolean
  })

  PojosMetadataMap.create<PouchPegelreihe>('PouchPegelreihe', {
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number
  });

  PojosMetadataMap.create<PouchAuswertungspegelreihe & PouchPegelreihe>('PouchAuswertungspegelreihe', {
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number,
    summiert: Number
  })

  PojosMetadataMap.create<PouchMetainfo>('PouchMetainfo', {
    name_messfile: String,
    messdatum: String,
    overviewfile: String,
    messgeraet: String,
  })

  PojosMetadataMap.create<Metainfo>('Metainfo', {
    name_messfile: String,
    messdatum: String,
    overviewfile: String,
    messgeraet: String,
  })



}

createUserMetadata();

export const mapper = createMapper({ strategyInitializer: pojos() });

function mapId4Backend(args: string) {
  const r1 = args.match(/^[a-zA-Z]/)
  console.log(args, r1)
  // Wenn mit Buchstaben begonnen wurde, ist die Id am Backend nicht vorhanden und es wird null geschickt
  if (r1 != null) {
    return null
  }
  if (args) {
    // Wenn es eine Id nur mit Zahlen ist
    const r = args.match(/(\d+)$/)
    if (r != null)
      return parseInt(r[0])
    else return null
  }


}

createMap<PegelreiheAuswertung, Auswertungspegelreihe>(mapper, 'PegelreiheAuswertung', 'Auswertungspegelreihe')
createMap<Auswertungspegelreihe, PegelreiheAuswertung>(mapper, 'Auswertungspegelreihe', 'PegelreiheAuswertung')

createMap<TreeNodeApi, Plant>(mapper, 'TreeNodeApi', 'Plant',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => `${dest.id}`)),
  forMember(src => src.header, mapFrom(() => 'werk')),
  forMember(src => src.body, mapFrom(() => 'werk')),
  forMember(src => src.children, mapFrom(src => src.children.map(i => mapper.map<TreeNodeApi, Building>(i, 'TreeNodeApi', 'Building')))),
  forMember(src => src.map, mapWith('KarteDetails', 'KarteApi', src => src.map)),
)

createMap<TreeNodeApi, Building>(mapper, 'TreeNodeApi', 'Building',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => `${dest.id}`)),
  forMember(src => src.idAtBackend, mapFrom(dest => parseInt(dest.id))),
  forMember(src => src.header, mapFrom(() => 'gebaeude')),
  forMember(src => src.body, mapFrom(() => 'gebaeude')),
  forMember(src => src.children, mapFrom(src => src.children.map(i => mapper.map<TreeNodeApi, Roof>(i, 'TreeNodeApi', 'Roof'))))
)

createMap<TreeNodeApi, Roof>(mapper, 'TreeNodeApi', 'Roof',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => `${dest.id}`)),
  forMember(src => src.map, mapWith('KarteDetails', 'KarteApi', src => src.map)),
  forMember(src => src.header, mapFrom(() => 'dach')),
  forMember(src => src.body, mapFrom(() => 'dach')),
  forMember(src => src.children, mapFrom(src => src.children.map(i => mapper.map<TreeNodeApi, Emittent>(i, 'TreeNodeApi', 'Emittent'))))
)

createMap<TreeNodeApi, Emittent>(mapper, 'TreeNodeApi', 'Emittent',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => `${dest.id}`)),
  forMember(src => src.header, mapFrom(() => 'emittent')),
  forMember(src => src.body, mapFrom(() => 'emittent')),
  forMember(src => src.koordinaten, mapWith('KoordinatenHoehe', 'Koordinaten', src => src.lage))

)

createMap<ProjectApi, Projekt>(mapper, 'ProjectApi', 'Project',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => `${dest.id}`))
)

createMap<Projekt, ProjectApi>(mapper, 'Project', 'ProjectApi',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => mapId4Backend(dest.id))),
  forMember(src => src.beschreibung, mapFrom(dest => 'Lets compare scars'))
)

createMap<MetainfoApi, Metainfo>(mapper, 'MetainfoApi', 'Metainfo',
  forMember(src => src.name_messfile, mapFrom(dest => dest.file_no)),
  forMember(src => src.id, mapFrom(dest => `${dest.id}`)),
  forMember(src => src.messdatum, mapFrom(dest => dest.datum)),
  forMember(src => src.overviewfile, mapFrom(dest => dest.overview_path)),
  forMember(src => src.messgeraet, mapFrom(dest => dest.messgeraet))

)
createMap<Metainfo, MetainfoApi>(mapper, 'Metainfo', 'MetainfoApi',
  forMember(src => src.id, mapFrom(dest => mapId4Backend(dest.id))),
  forMember(src => src.file_no, mapFrom(dest => dest.name_messfile)),
  forMember(src => src.datum, mapFrom(dest => '2022-09-12')),
  forMember(src => src.overview_path, mapFrom(dest => dest.overviewfile)),
  forMember(src => src.messgeraet, mapFrom(dest => dest.messgeraet)),
)
createMap<Roof, RoofApi>(mapper, 'Roof', 'RoofApi',
  forMember(dest => dest.name, mapFrom((src) => src.name)),
  forMember(dest => dest.map, mapFrom(() => null)),
  forMember(dest => dest.building, mapFrom(src => {
    src.parent
  })))

createMap<RoofApi, Roof>(mapper, 'RoofApi', 'Roof',
  forMember(src => src.header, mapFrom(() => 'dach')),
  forMember(src => src.id, mapFrom(src => `${src.id}`)),
  forMember(src => src.body, mapFrom(() => 'dach')),
  forMember(src => src.children, mapFrom(() => [])),

  forMember(dest => dest.parent, mapFrom(src => {
    src.building
  })))

createMap<Building, BuildingAPI>(mapper, 'Building', 'BuildingApi',
  forMember(dest => dest.id, mapFrom(src => src.idAtBackend)),
  /*
  forMember(dest => dest.plant, mapFrom(src =>
    src.parent
  )
  )*/)

createMap<BuildingAPI, Building>(mapper, 'BuildingApi', 'Building',
  forMember(src => src.id, mapFrom(src => `${src.id}`)),
  forMember(src => src.header, mapFrom(() => 'gebaeude')),
  forMember(src => src.body, mapFrom(() => 'gebaeude')),
  forMember(src => src.children, mapFrom(() => [])),
  forMember(dest => dest.parent, mapFrom(src => {
    return `P${src.plant}`
  })))


createMap<Emittent, EmittentApi>(mapper, 'Emittent', 'EmittentApi',


  forMember(dest => dest.roof, mapFrom(src => {
    console.log(src)
    const r = src.parent.match(/(\d+)$/)
    if (r != null)
      return parseInt(r[0])
    else return 0
  })),
  forMember(dest => dest.lage, mapWith('KoordinatenHoehe', 'Koordinaten', src => src.koordinaten)))

createMap<EmittentApi, Emittent>(mapper, 'EmittentApi', 'Emittent',
  forMember(src => src.id, mapFrom(src => `${src.id}`)),
  forMember(src => src.header, mapFrom(() => 'emittent')),
  forMember(src => src.body, mapFrom(() => 'emittent')),
  forMember(dest => dest.parent, mapFrom(src => {
    return `R${src.roof}`
  })),
  forMember(dest => dest.koordinaten, mapWith('Koordinaten', 'KoordinatenHoehe', src => src.lage)))

createMap<Referenzierungspunkt, Georeferenzierungspunkt>(mapper, 'ReferenzierungspunktApi', 'Georeferenzierungspunkt',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.koordinaten.gk_hoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.koordinaten.gk_rechts)),
  forMember(dest => dest.pixel_x, mapFrom(src => src.pixel_x)),
  forMember(dest => dest.pixel_y, mapFrom(src => src.pixel_y)))

createMap<Koordinaten, KoordinatenApi>(mapper, 'Koordinaten', 'KoordinatenApi',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gk_rechts))

)

createMap<KoordinatenApi, Koordinaten>(mapper, 'KoordinatenApi', 'Koordinaten',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gk_rechts))
)

createMap<Koordinaten, KoordinatenHoehe>(mapper, 'Koordinaten', 'KoordinatenHoehe',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gk_rechts)),
  forMember(dest => dest.hoehe, mapFrom(src => 0))
)

createMap<KoordinatenHoehe, Koordinaten>(mapper, 'KoordinatenHoehe', 'Koordinaten',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gkrechts))
)


createMap<Georeferenzierungspunkt, KoordinatenApi>(mapper, 'Georeferenzierungspunkt', 'KoordinatenApi',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gk_rechts)))

createMap<Georeferenzierungspunkt, Referenzierungspunkt>(mapper, 'Georeferenzierungspunkt', 'ReferenzierungspunktApi',
  forMember(dest => dest.pixel_x, mapFrom(src => src.pixel_x)),
  forMember(dest => dest.pixel_y, mapFrom(src => src.pixel_y)),
  forMember(dest => dest.koordinaten, mapWith('KoordinatenApi', 'Georeferenzierungspunkt', src => src))
)
createMap<GeoreferenzierungApi, Georeferenzierung>(mapper, 'GeoreferenzierungApi', 'Georeferenzierung')

createMap<Georeferenzierung, GeoreferenzierungApi>(mapper, 'Georeferenzierung', 'GeoreferenzierungApi')

createMap<KarteApi, KarteDetails>(mapper, 'KarteApi', 'KarteDetails',
  forMember(dest => dest.url, mapFrom(src => src.upload)),
  forMember(dest => dest.idAtBackend, mapFrom(src => parseInt(src.id))),
  forMember(dest => dest.zuordnung, mapFrom(src => {
    if (src.plant_set.length > 0) {
      return `P${src.plant_set[0]}`

    } else if (src.roof_set.length > 0) {
      return `R${src.roof_set[0]}`

    } else return null
  })))

createMap<KarteDetails, KarteApi>(mapper, 'KarteDetails', 'KarteApi',

  forMember(dest => dest.upload, mapFrom(src => src.url)),
  forMember(dest => dest.plant_set, mapFrom(src => {
    console.log(src)
    if (src.zuordnung != null && src.zuordnung.search(/P/) != -1) {

      const r = src.zuordnung.match(/(\d+)$/)
      if (r != null) {
        return [parseInt(r[0])]
      } else return []

    } else return []

  })),
  forMember(dest => dest.roof_set, mapFrom(src => {
    if (src.zuordnung != null && src.zuordnung.search(/R/) != -1) {

      const r = src.zuordnung.match(/(\d+)$/)
      if (r != null) {
        return [parseInt(r[0])]
      } else return []

    } else return []


  })))


export function getIdFromString(src: string | null | undefined) {
  if (src != null) {
    const r = src.match(/(\d+)$/)
    if (r != null) {
      return parseInt(r[0])
    }
  }
  throw new Error('src was null')

}
createMap<Plant, Werk>(mapper, 'Plant', 'Werk',

  forMember(dest => dest.map, mapFrom(src => null)),
  //forMember(dest => dest.project, mapFrom(src => src.project_id))
)


createMap<Werk, Plant>(mapper, 'Werk', 'Plant',
  forMember(src => src.id, mapFrom(src => `${src.id}`)),
  forMember(dest => dest.map, mapFrom(src => null)),
  forMember(src => src.header, mapFrom(() => 'werk')),
  forMember(src => src.body, mapFrom(() => 'werk')),
  // forMember(dest => dest.project_id, mapFrom(src => src.project)),
  forMember(src => src.children, mapFrom(() => []))
)



createMap<Messgeraet, MessgeraetApi>(mapper, 'Messgeraet', 'MessgeraetApi',

  forMember(dest => dest.name, mapFrom(src => src.name)),
  forMember(dest => dest.id, mapFrom(src => src.idAtBackend)),
  forMember(dest => dest.hz31_5, mapFrom(src => src.hz31_5)),
  forMember(dest => dest.hz63, mapFrom(src => src.hz63,)),
  forMember(dest => dest.hz125, mapFrom(src => src.hz125,)),
  forMember(dest => dest.hz250, mapFrom(src => src.hz250,)),
  forMember(dest => dest.hz500, mapFrom(src => src.hz500,)),
  forMember(dest => dest.hz1000, mapFrom(src => src.hz1000)),
  forMember(dest => dest.hz2000, mapFrom(src => src.hz2000)),
  forMember(dest => dest.hz4000, mapFrom(src => src.hz4000)),
  forMember(dest => dest.hz8000, mapFrom(src => src.hz8000)),
)

createMap<MessgeraetApi, Messgeraet>(mapper, 'MessgeraetApi', 'Messgeraet',

  forMember(dest => dest.name, mapFrom(src => src.name)),
  forMember(dest => dest.idAtBackend, mapFrom(src => src.id)),
  forMember(dest => dest.hz31_5, mapFrom(src => src.hz31_5)),
  forMember(dest => dest.hz63, mapFrom(src => src.hz63,)),
  forMember(dest => dest.hz125, mapFrom(src => src.hz125,)),
  forMember(dest => dest.hz250, mapFrom(src => src.hz250,)),
  forMember(dest => dest.hz500, mapFrom(src => src.hz500,)),
  forMember(dest => dest.hz1000, mapFrom(src => src.hz1000)),
  forMember(dest => dest.hz2000, mapFrom(src => src.hz2000)),
  forMember(dest => dest.hz4000, mapFrom(src => src.hz4000)),
  forMember(dest => dest.hz8000, mapFrom(src => src.hz8000)),
)

createMap<EmittentDetails, KoordinatenHoehe>(mapper, 'EmittentDetails', 'KoordinatenHoeheAPI',
  forMember(dest => dest.gkrechts, mapFrom((src) => src.gkrechts)),
  forMember(dest => dest.gkhoch, mapFrom((src) => src.gkhoch)),
  forMember(dest => dest.hoehe, mapFrom((src) => src.hoehe)))


createMap<EmittentDetail, EmittentDetails>(mapper, 'EmittentDetailsAPI', 'EmittentDetails',
  forMember(dest => dest.messungen, mapFrom(src =>
    src.ein_punkt_messungen.map(i => mapper.map<EinPunktMessung, Messung>(i, 'EinPunktMessungAPI', 'Messung')

    ).concat(src.drei_punkt_messungen.map(i => mapper.map<DreiPunktMessung, Messung>(i, 'DreiPunktMessungAPI', 'Messung')))
      .concat(src.kamin_messungen.map(i => mapper.map<KaminMessung, Messung>(i, 'KaminMessungAPI', 'Messung')))
      .concat(src.vier_punkt_messungen.map(i => mapper.map<VierPunktMessung, Messung>(i, 'VierPunktMessungAPI', 'Messung')))
      .concat(src.fuenf_punkt_messungen.map(i => mapper.map<FuenfPunktMessung, Messung>(i, 'FuenfPunktMessungAPI', 'Messung')))
  )),
  forMember(dest => dest.gkrechts, mapFrom(src => src.lage?.gkrechts)),
  forMember(dest => dest.gkhoch, mapFrom(src => src.lage?.gkhoch)),
  forMember(dest => dest.hoehe, mapFrom(src => src.lage?.hoehe)),
  forMember(dest => dest.picture, mapFrom(src => src.image)),
  forMember(dest => dest.id, mapFrom(src => `${src.id}`)),
  forMember(dest => dest.idAtBackend, mapFrom(src => src.id)))
createMap<EmittentDetails, EmittentDetail>(mapper, 'EmittentDetails', 'EmittentDetailsAPI',
  forMember(dest => dest.ein_punkt_messungen, mapFrom(src => src.messungen.filter(i => i.type == '1P').map(i => {
    const r = mapper.map<Messung, EinPunktMessung>(i, 'Messung', 'EinPunktMessungAPI')
    r.emittent = mapId4Backend(src.id)!
    console.log(src, r)
    return r
  }))),
  forMember(dest => dest.drei_punkt_messungen, mapFrom(src => src.messungen.filter(i => i.type == '3P').map(i => {
    const r = mapper.map<Messung, DreiPunktMessung>(i, 'Messung', 'DreiPunktMessungAPI')
    r.emittent = src.idAtBackend!
    return r
  }))),
  forMember(dest => dest.vier_punkt_messungen, mapFrom(src => src.messungen.filter(i => i.type == '4P').map(i => {
    const r = mapper.map<Messung, VierPunktMessung>(i, 'Messung', 'VierPunktMessungAPI')
    r.emittent = src.idAtBackend!
    return r
  }))),
  forMember(dest => dest.kamin_messungen, mapFrom(src => src.messungen.filter(i => i.type == 'Kamin').map(i => {
    const r = mapper.map<Messung, KaminMessung>(i, 'Messung', 'KaminMessungAPI')
    r.emittent = src.idAtBackend!
    return r
  }))),
  forMember(
    (destination) => destination.lage,
    mapWith('KoordinatenHoeheAPI', 'EmittentDetails', src => src)))

createMap<EinPunktMessung, Messung>(mapper, 'EinPunktMessungAPI', 'Messung',
  forMember(dest => dest.type, mapFrom(() => '1P')),
  forMember(dest => dest.messverfahren, mapFrom(src => src.typ)),
  forMember(dest => dest.datum, mapFrom(src => '2023-01-09T15:00:00.601Z')),
  forMember(dest => dest.geometrie_messung, mapWith('GeometrieMessung', 'GeometrieMessungAPI', src => src.messung_geometrie)),
  forMember(dest => dest.geometrie_emittent, mapWith('GeometrieEmittent', 'GeometrieEmittentAPI', src => src.emittent_geometrie)),
  forMember(dest => dest.auswertung, mapWith('AuswertungDefault', 'EinPunktAuswertungAPI', src => src.auswertung)),
  forMember(dest => dest.messpositionen, mapFrom(
    (src) => {
      const r = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_1, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(r)
      return [r]
    }
  ) //src.messposition1.messpositionpegelreiheSet
  ))




createMap<EinPunktAuswertung, AuswertungDefault>(mapper, 'EinPunktAuswertungAPI', 'AuswertungDefault',
  forMember(dest => dest.anlagenpegel, mapFrom(src => [{ ...mapper.map<PegelreiheAPI, Pegelreihe>(src.anlagenpegel_1, 'PegelreiheAPI', 'Pegelreihe'), korrektur: src.korrekturwert_1 }])),
  forMember(dest => dest.id, mapFrom(src => `${src.id}`)),
)

createMap<AuswertungDefault, EinPunktAuswertung>(mapper, 'AuswertungDefault', 'EinPunktAuswertungAPI',
  forMember(dest => dest.id, mapFrom(src => mapId4Backend(src.id))),
  forMember(dest => dest.korrekturwert_1, mapFrom(src => src.anlagenpegel[0].korrektur)),
  forMember(dest => dest.anlagenpegel_1, mapWith('PegelreiheAPI', 'Pegelreihe', src => src.anlagenpegel[0])))

createMap<GeometrieMessung, GeometrieMessungAPI>(mapper, 'GeometrieMessung', 'GeometrieMessungAPI',
  forMember(dest => dest.geo_xy, mapFrom(src => src.geoxy)),
  forMember(dest => dest.geo_h, mapFrom(src => src.geoh)),
  forMember(dest => dest.geo_k_omega, mapFrom(src => src.komega)),
  forMember(dest => dest.geo_k_2_a, mapFrom(src => src.k2a)),
  forMember(dest => dest.id, mapFrom(src => mapId4Backend(src.id))))

createMap<GeometrieMessungAPI, GeometrieMessung>(mapper, 'GeometrieMessungAPI', 'GeometrieMessung',
  forMember(dest => dest.geoxy, mapFrom(src => src.geo_xy)),
  forMember(dest => dest.geoh, mapFrom(src => src.geo_h)),
  forMember(dest => dest.k2a, mapFrom(src => src.geo_k_2_a)),
  forMember(dest => dest.komega, mapFrom(src => src.geo_k_omega)),
  forMember(dest => dest.id, mapFrom(src => `${src.id}`))
)

createMap<GeometrieEmittent, GeometrieEmittentAPI>(mapper, 'GeometrieEmittent', 'GeometrieEmittentAPI',
  forMember(dest => dest.geo_1, mapFrom(src => src.geo1)),
  forMember(dest => dest.geo_2, mapFrom(src => src.geo2)),
  forMember(dest => dest.geo_3, mapFrom(src => src.geo3)),
  forMember(dest => dest.geo_4, mapFrom(src => src.geo4)),
  forMember(dest => dest.id, mapFrom(src => mapId4Backend(src.id))))

createMap<GeometrieEmittentAPI, GeometrieEmittent>(mapper, 'GeometrieEmittentAPI', 'GeometrieEmittent',
  forMember(dest => dest.geo1, mapFrom(src => src.geo_1)),
  forMember(dest => dest.geo2, mapFrom(src => src.geo_2)),
  forMember(dest => dest.geo3, mapFrom(src => src.geo_3)),
  forMember(dest => dest.geo4, mapFrom(src => src.geo_4)),
  forMember(dest => dest.id, mapFrom(src => `${src.id}`))
)

createMap<Messung, EinPunktMessung>(mapper, 'Messung', 'EinPunktMessungAPI',
  forMember(dest => dest.messposition_1, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[0])),
  forMember(dest => dest.emittent_geometrie, mapWith('GeometrieEmittentAPI', 'GeometrieEmittent', src => src.geometrie_emittent)),
  forMember(dest => dest.messung_geometrie, mapWith('GeometrieMessungAPI', 'GeometrieMessung', src => src.geometrie_messung)),
  forMember(dest => dest.typ, mapFrom(src => src.messverfahren)),
  forMember(dest => dest.auswertung, mapWith('EinPunktAuswertungAPI', 'AuswertungDefault', src => src.auswertung)),

)

createMap<Messung, DreiPunktMessung>(mapper, 'Messung', 'DreiPunktMessungAPI')
createMap<DreiPunktMessung, Messung>(mapper, 'DreiPunktMessungAPI', 'Messung', forMember(dest => dest.type, mapFrom(() => '3P')))

createMap<Messung, KaminMessung>(mapper, 'Messung', 'KaminMessungAPI',
  forMember(dest => dest.messposition_a1, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[0])),
  forMember(dest => dest.messposition_a2, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[1])),
  forMember(dest => dest.messposition_b1, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[2])),
  forMember(dest => dest.messposition_b2, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[3])),
  forMember(dest => dest.emittent_geometrie, mapWith('GeometrieEmittentAPI', 'GeometrieEmittent', src => src.geometrie_emittent)),
  forMember(dest => dest.messung_geometrie, mapWith('GeometrieMessungAPI', 'GeometrieMessung', src => src.geometrie_messung)),
  forMember(dest => dest.typ, mapFrom(src => src.messverfahren)),
  forMember(dest => dest.auswertung, mapWith('EinPunktAuswertungAPI', 'AuswertungDefault', src => src.auswertung)),)

createMap<KaminMessung, Messung>(mapper, 'KaminMessungAPI', 'Messung',
  forMember(dest => dest.type, mapFrom(() => 'Kamin')),
  forMember(dest => dest.messverfahren, mapFrom(src => src.typ)),
  forMember(dest => dest.datum, mapFrom(src => '2023-01-09T15:00:00.601Z')),
  forMember(dest => dest.geometrie_messung, mapWith('GeometrieMessung', 'GeometrieMessungAPI', src => src.messung_geometrie)),
  forMember(dest => dest.geometrie_emittent, mapWith('GeometrieEmittent', 'GeometrieEmittentAPI', src => src.emittent_geometrie)),
  forMember(dest => dest.auswertung, mapWith('AuswertungDefault', 'EinPunktAuswertungAPI', src => src.auswertung)),
  forMember(dest => dest.messpositionen, mapFrom(
    (src) => {
      const a1 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_a1, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const a2 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_a2, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const b1 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_b1, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const b2 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_b2, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      return [a1, a2, b1, b2]
    }
  ) //src.messposition1.messpositionpegelreiheSet
  ))

createMap<Messung, VierPunktMessung>(mapper, 'Messung', 'VierPunktMessungAPI',
  forMember(dest => dest.messposition_1, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[0])),
  forMember(dest => dest.messposition_2, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[1])),
  forMember(dest => dest.messposition_3, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[2])),
  forMember(dest => dest.messposition_4, mapWith('MesspositionAPI', 'MesspoistionEditViewModel', src => src.messpositionen[3])),
  forMember(dest => dest.emittent_geometrie, mapWith('GeometrieEmittentAPI', 'GeometrieEmittent', src => src.geometrie_emittent)),
  forMember(dest => dest.messung_geometrie, mapWith('GeometrieMessungAPI', 'GeometrieMessung', src => src.geometrie_messung)),
  forMember(dest => dest.typ, mapFrom(src => src.messverfahren)),
  forMember(dest => dest.auswertung, mapWith('EinPunktAuswertungAPI', 'AuswertungDefault', src => src.auswertung)),
)
createMap<VierPunktMessung, Messung>(mapper, 'VierPunktMessungAPI', 'Messung',
  forMember(dest => dest.type, mapFrom(() => '4P')),
  forMember(dest => dest.messverfahren, mapFrom(src => src.typ)),
  forMember(dest => dest.datum, mapFrom(src => '2023-01-09T15:00:00.601Z')),
  forMember(dest => dest.geometrie_messung, mapWith('GeometrieMessung', 'GeometrieMessungAPI', src => src.messung_geometrie)),
  forMember(dest => dest.geometrie_emittent, mapWith('GeometrieEmittent', 'GeometrieEmittentAPI', src => src.emittent_geometrie)),
  forMember(dest => dest.auswertung, mapWith('AuswertungDefault', 'EinPunktAuswertungAPI', src => src.auswertung)),
  forMember(dest => dest.messpositionen, mapFrom(
    (src) => {
      const a1 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_1, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const a2 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_2, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const b1 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_3, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const b2 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_4, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      return [a1, a2, b1, b2]
    }
  ))
)

createMap<Messung, VierPunktMessung>(mapper, 'Messung', 'FuenfPunktMessungAPI')
createMap<FuenfPunktMessung, Messung>(mapper, 'FuenfPunktMessungAPI', 'Messung',
  forMember(dest => dest.type, mapFrom(() => '5P')),
  forMember(dest => dest.messverfahren, mapFrom(src => src.typ)),
  forMember(dest => dest.datum, mapFrom(src => '2023-01-09T15:00:00.601Z')),
  forMember(dest => dest.geometrie_messung, mapWith('GeometrieMessung', 'GeometrieMessungAPI', src => src.messung_geometrie)),
  forMember(dest => dest.geometrie_emittent, mapWith('GeometrieEmittent', 'GeometrieEmittentAPI', src => src.emittent_geometrie)),
  forMember(dest => dest.auswertung, mapWith('AuswertungDefault', 'EinPunktAuswertungAPI', src => src.auswertung)),
  forMember(dest => dest.messpositionen, mapFrom(
    (src) => {
      const a1 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_1, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const a2 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_2, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const a3 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_3, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const a4 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_4, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      const a5 = mapper.map<MesspositionAPI, MesspositionEditViewModel>(src.messposition_5, 'MesspositionAPI', 'MesspoistionEditViewModel')
      console.log(a1)
      return [a1, a2, a3, a4, a5]
    }
  )))

createMap<MesspositionAPI, MesspositionEditViewModel>(mapper, 'MesspositionAPI', 'MesspoistionEditViewModel',
  forMember(dest => dest.messwertereihen, mapFrom(src => src.messpositionpegelreihe_set.map(i => mapper.map<MesspositionPegelreiheSerializerV2, MesspunktAnAnlage>(i, 'MesspunktAnAnlage', 'MesspostionPegelreihe')))))

createMap<MesspositionEditViewModel, MesspositionAPI>(mapper, 'MesspoistionEditViewModel', 'MesspositionAPI',
  forMember(dest => dest.messpositionpegelreihe_set, mapFrom(src => src.messwertereihen.map(i => mapper.map<MesspunktAnAnlage, MesspositionPegelreiheSerializerV2>(i, 'MesspostionPegelreihe', 'MesspunktAnAnlage'))))
)

createMap<MesspositionPegelreiheSerializerV2, MesspunktAnAnlage>(mapper, 'MesspunktAnAnlage', 'MesspostionPegelreihe',
  forMember(dest => dest.gesamtpegel, mapWith('PegelreiheAPI', 'Pegelreihe', src => src.gesamtpegel)),
  forMember(dest => dest.metainfoGesamtpegel, mapWith('Metainfo', 'MetainfoApi', src => src.metainfo_gesamtpegel)),
  forMember(dest => dest.fremdpegel, mapFrom(src => src.fremdpegel != null ? mapper.map(src.fremdpegel, 'PegelreiheAPI', 'Pegelreihe') : messwertereiheFactory.build())),
  forMember(dest => dest.metainfoFremdpegel, mapFrom(src => src.metainfo_fremdpegel != null ? mapper.map(src.metainfo_fremdpegel, 'MetainfoApi', 'Metainfo') : metainfoFactory.build())),
  forMember(dest => dest.fremdpegelVorhanden, mapFrom(src => src.fremdpegel != null)))

createMap<MesspunktAnAnlage, MesspositionPegelreiheSerializerV2>(mapper, 'MesspostionPegelreihe', 'MesspunktAnAnlage',
  forMember(dest => dest.gesamtpegel, mapWith('Pegelreihe', 'PegelreiheAPI', src => src.gesamtpegel)),
  forMember(dest => dest.metainfo_gesamtpegel, mapWith('MetainfoApi', 'Metainfo', src => src.metainfoGesamtpegel)),
  forMember(dest => dest.fremdpegel, mapFrom(src => src.fremdpegelVorhanden ? mapper.map(src.fremdpegel, 'PegelreiheAPI', 'Pegelreihe') : null)),
  forMember(dest => dest.metainfo_fremdpegel, mapFrom(src => src.fremdpegelVorhanden ? mapper.map(src.metainfoFremdpegel, 'Metainfo', 'MetainfoApi') : null)),
)


createMap<Pegelreihe, PegelreiheAPI>(mapper, 'Pegelreihe', 'PegelreiheAPI')
createMap<PegelreiheAPI, Pegelreihe>(mapper, 'PegelreiheAPI', 'Pegelreihe')


createMap<Pegelreihe, Pegelreihe>(
  mapper, 'Messwertereihe', 'Messwertereihe'
)

createMap<Messung, Messung>(
  mapper,
  'Messung',
  'Messung',
)




createMap<Pegelreihe, PegelreiheAPI>(
  mapper,
  'Pegelreihe',
  'PegelreiheAPI',
  forMember(
    (destination) => destination.hz31_5,
    mapFrom((src) => src.hz31_5)),
)

createMap<PegelreiheAPI, Pegelreihe>(
  mapper,
  'PegelreiheAPI',
  'Pegelreihe',
)


createMap<PouchPlant, Plant>(mapper, 'PouchPlant', 'Plant',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.header, mapFrom(() => 'werk')),
  forMember(src => src.body, mapFrom(() => 'werk')),
  forMember(src => src.children, mapFrom(() => []))
  // forMember(src => src.map, mapWith('KarteDetails', 'KarteApi', src => src.map)),
)

createMap<Plant, PouchPlant>(mapper, 'Plant', 'PouchPlant',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.descriminator, mapFrom(() => 'plant')),
  // forMember(src => src.map, mapWith('KarteDetails', 'KarteApi', src => src.map)),
)

createMap<Building, PouchBuilding>(mapper, 'Building', 'PouchBuilding',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.descriminator, mapFrom(() => 'building')),
)

createMap<PouchBuilding, Building>(mapper, 'PouchBuilding', 'Building',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.header, mapFrom(() => 'gebaeude')),
  forMember(src => src.body, mapFrom(() => 'gebaeude')),
  forMember(src => src.children, mapFrom(() => [])),
)

createMap<Roof, PouchRoof>(mapper, 'Roof', 'PouchRoof',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.descriminator, mapFrom(() => 'roof')),
)

createMap<PouchRoof, Roof>(mapper, 'PouchRoof', 'Roof',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.header, mapFrom(() => 'dach')),
  forMember(src => src.body, mapFrom(() => 'dach')),
  forMember(src => src.children, mapFrom(() => [])),
)

createMap<Emittent, PouchEmittent>(mapper, 'Emittent', 'PouchEmittent',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.discriminator, mapFrom(() => 'emittent')),
  forMember(src => src.lage, mapWith('PouchKoordinatenHoehe', 'KoordinatenHoehe', src => src.koordinaten)),
  forMember(src => src.messungen, mapFrom(() => [])),
  forMember(src => src.luftschadstoffe, mapFrom(() => luftschadstoffeFactory.build()))
)

createMap<PouchEmittent, Emittent>(mapper, 'PouchEmittent', 'Emittent',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.header, mapFrom(() => 'emittent')),
  forMember(src => src.body, mapFrom(() => 'emittent')),
  forMember(src => src.koordinaten, mapWith('KoordinatenHoehe', 'PouchKoordinatenHoehe', src => src.lage)),
  forMember(src => src.messungen, mapFrom(() => [])),
)

createMap<KarteDetails, PouchMap>(mapper, 'KarteDetails', 'PouchMap',
  forMember(src => src.id, mapFrom(dest => dest.id)),
)
createMap<PouchMap, KarteDetails>(mapper, 'PouchMap', 'KarteDetails',
  forMember(src => src.id, mapFrom(dest => dest.id)),
)

createMap<Koordinaten, PouchKoordinaten>(mapper, 'Koordinaten', 'PouchKoordinaten',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gk_rechts))

)

createMap<PouchKoordinaten, Koordinaten>(mapper, 'PouchKoordinaten', 'Koordinaten',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gkrechts))
)

createMap<KoordinatenHoehe, PouchKoordinatenHoehe>(mapper, 'KoordinatenHoehe', 'PouchKoordinatenHoehe',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))

)

createMap<PouchKoordinatenHoehe, KoordinatenHoehe>(mapper, 'PouchKoordinatenHoehe', 'KoordinatenHoehe',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))
)

createMap<EmittentDetails, PouchKoordinatenHoehe>(mapper, 'EmittentDetails', 'PouchKoordinatenHoehe',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))
)

createMap<PouchKoordinatenHoehe, EmittentDetails>(mapper, 'PouchKoordinatenHoehe', 'EmittentDetails',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))
)


createMap<PouchEmittent, EmittentDetails>(mapper, 'PouchEmittent', 'EmittentDetails',
  forMember(dest => dest.name, mapFrom(src => src.name)),
  forMember(dest => dest.gkhoch, mapFrom(src => src.lage.gkhoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.lage.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.lage.hoehe)),
  forMember(dest => dest.id, mapFrom(src => src.id)),
  forMember(dest => dest.bearbeiter, mapFrom(src => src.bearbeiter)),
  forMember(dest => dest.liegt_an_fassade, mapFrom(src => src.liegtAnFassade)),
  forMember(dest => dest.fuer_messung_vormerken, mapFrom(src => src.fuerMessungVormerken)),
  forMember(dest => dest.in_betrieb, mapFrom(src => src.inBetrieb)),
  forMember(dest => dest.messungen, mapFrom(src => src.messungen.map(i => mapper.map(i, 'PouchMessung', 'Messung'))))

)

createMap<EmittentDetails, PouchEmittent>(mapper, 'EmittentDetails', 'PouchEmittent',
  forMember(dest => dest.lage, mapWith('PouchKoordinatenHoehe', 'EmittentDetails', src => src)),
  forMember(dest => dest.name, mapFrom(src => src.name)),
  forMember(dest => dest.id, mapFrom(src => src.id)),
  forMember(dest => dest.bearbeiter, mapFrom(src => src.bearbeiter)),
  forMember(dest => dest.liegtAnFassade, mapFrom(src => src.liegt_an_fassade)),
  forMember(dest => dest.fuerMessungVormerken, mapFrom(src => src.fuer_messung_vormerken)),
  forMember(dest => dest.inBetrieb, mapFrom(src => src.in_betrieb)),
  forMember(dest => dest.messungen, mapFrom(src => src.messungen.map(i => mapper.map(i, 'Messung', 'PouchMessung')))),
  forMember(dest => dest.discriminator, mapFrom(src => 'emittent')),
)

createMap<Messung, PouchMessung>(mapper, 'Messung', 'PouchMessung',
  forMember(dest => dest.datum, mapFrom(src => new Date(src.datum).getTime()))
)
createMap<PouchMessung, Messung>(mapper, 'PouchMessung', 'Messung',
  forMember(dest => dest.datum, mapFrom(src => new Date(src.datum).toISOString()))
)

createMap<Messgeraet, PouchMessgeraet>(mapper, 'Messgeraet', 'PouchMessgeraet')
createMap<PouchMessgeraet, Messgeraet>(mapper, 'PouchMessgeraet', 'Messgeraet')

createMap<Projekt, PouchProject>(mapper, 'Projekt', 'PouchProject',
  forMember(dest => dest.name, mapFrom(src => src.name)),
  forMember(dest => dest.id, mapFrom(src => src.id)),
  forMember(dest => dest.dbName, mapFrom(src => src.dbName))
)

createMap<PouchProject, Projekt>(mapper, 'PouchProject', 'Projekt',
  forMember(dest => dest.name, mapFrom(src => src.name))
  , forMember(dest => dest.id, mapFrom(src => src.id)),
  forMember(dest => dest.dbName, mapFrom(src => src.dbName))
)

createMap<MesspositionEditViewModel, PouchMessposition>(mapper, 'MesspositionEditViewModel', 'PouchMessposition')
createMap<PouchMessposition, MesspositionEditViewModel>(mapper, 'PouchMessposition', 'MesspositionEditViewModel')

createMap<PouchGeometrieEmittent, GeometrieEmittent>(mapper, 'PouchGeometrieEmittent', 'GeometrieEmittent')
createMap<GeometrieEmittent, PouchGeometrieEmittent>(mapper, 'GeometrieEmittent', 'PouchGeometrieEmittent')

createMap<PouchGeometrieMessung, GeometrieMessung>(mapper, 'PouchGeometrieMessung', 'GeometrieMessung')
createMap<GeometrieMessung, PouchGeometrieMessung>(mapper, 'GeometrieMessung', 'PouchGeometrieMessung')

createMap<PouchMesspunktAnAnlage, MesspunktAnAnlage>(mapper, 'PouchMesspunktAnAnlage', 'MesspunktAnAnlage')
createMap<MesspunktAnAnlage, PouchMesspunktAnAnlage>(mapper, 'MesspunktAnAnlage', 'PouchMesspunktAnAnlage')

createMap<PouchPegelreihe, Pegelreihe>(mapper, 'PouchPegelreihe', 'Pegelreihe')
createMap<Pegelreihe, PouchPegelreihe>(mapper, 'Pegelreihe', 'PouchPegelreihe')

createMap<Metainfo, PouchMetainfo>(mapper, 'Metainfo', 'PouchMetainfo',)
createMap<PouchMetainfo, Metainfo>(mapper, 'PouchMetainfo', 'Metainfo')

createMap<AuswertungDefault, PouchAuswertung>(mapper, 'AuswertungDefault', 'PouchAuswertung',)
createMap<PouchAuswertung, AuswertungDefault>(mapper, 'PouchAuswertung', 'AuswertungDefault')

createMap<PouchAuswertungspegelreihe, Auswertungspegelreihe>(mapper, 'PouchAuswertungspegelreihe', 'Auswertungspegelreihe')
createMap<Auswertungspegelreihe, PouchAuswertungspegelreihe>(mapper, 'Auswertungspegelreihe', 'PouchAuswertungspegelreihe')


