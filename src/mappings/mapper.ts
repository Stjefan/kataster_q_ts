import { CamelCaseNamingConvention, createMap, createMapper, extend, forMember, mapFrom, mapWith, namingConventions } from '@automapper/core';
import { afterMap } from '@automapper/core/lib/mapping-configurations/after-map';

import { PojosMetadataMap, pojos } from '@automapper/pojos';
import {
  PouchEmittentBackup, PouchAuswertung, PouchAuswertungspegelreihe, PouchBuilding,
  PouchEmittent, PouchGeometrieEmittent, PouchGeometrieMessung, PouchKoordinaten, PouchKoordinatenHoehe,
  PouchMap, PouchMessgeraet, PouchMessposition, PouchMesspunktAnAnlage,
  PouchMessung, PouchMetainfo, PouchPegelreihe, PouchPlant, PouchProject, PouchRoof,
  PouchVorlageExcelbericht, PouchPositionFeldExcelBericht, PouchFeldExcelBericht, PouchLuftschadstoffmessung, PouchLuftschadstoffgenehmigung, PouchFileReference, PouchGeoreferenzierung, PouchGeoreferenzierungspunkt, PouchOverview
} from 'src/models/pouch-api';


import {
  SchallmessungForm,
  LuftschadstoffeForm, GenehmigungForm, KarteForm, KoordinatenForm, GeoreferenzierungForm, GeoreferenzierungspunktForm, ProjectForm, MessgeraetForm, OverviewForm, FormFeldExcelBericht, FormPositionFeldExcelBericht, FormVorlageExcelbericht, EmittentDetailsForm
} from 'src/models/forms'
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
  luftschadstoffeFactory,
  VorlageExcelbericht,
  PositionFeldExcelBericht,
  FeldExcelBericht
} from 'src/models/v1';

import {
  MessgeraetApi,
  PegelreiheAuswertung,
  TreeNodeApi,
  Project as ProjectApi,
  Emittent as EmittentApi,
  Georeferenzierung as GeoreferenzierungApi, Referenzierungspunkt, Koordinaten as KoordinatenApi,
  Pegelreihe as PegelreiheAPI, Werk, EinPunktMessung, DreiPunktMessung, KoordinatenHoehe, GeometrieEmittent as GeometrieEmittentAPI, GeometrieMessung as GeometrieMessungAPI,
  Messposition as MesspositionAPI, EinPunktAuswertung, MesspositionPegelreiheSerializerV2, EmittentDetail, Metainfo as MetainfoApi, VierPunktMessung, FuenfPunktMessung, Building as BuildingAPI, Roof as RoofAPI, KarteApi, KaminMessung,
} from '../models/api'



export function createUserMetadata() {

  PojosMetadataMap.create<SchallmessungForm>('SchallmessungForm', {
    id: String,

    datum: String,

    // geometrie_emittent: PouchGeometrieEmittent,
    // geometrie_messung: PouchGeometrieMessung

    // messpositionen: PouchMessposition[]

    // auswertung: PouchAuswertung | null

    type: String,

    messverfahren: String,

  })

  PojosMetadataMap.create<EmittentDetailsForm>('EmittentDetailsForm', {
    id: String,
    name: String,
    gkRechts: Number,
    gkHoch: Number,
    hoehe: Number,
    bemerkung: String,
    messungen: ['SchallmessungForm'],
    picture: String,
    filename: String,

    bearbeiter: String,
    kostenstelle: String,
    abteilung: String,
    messinstitut: String,
    anlage: String,
    created: String,
    modified: String,
    inBetrieb: Boolean,
    fuerMessungVormerken: Boolean,
    anFassade: Boolean,

  })
  PojosMetadataMap.create<FormVorlageExcelbericht>('FormVorlageExcelbericht', {
    id: String,
    filename: String,
    name: String,
    fields: ['FormPositionFeldExcelBericht']
  })

  PojosMetadataMap.create<FormPositionFeldExcelBericht>('FormPositionFeldExcelBericht', {
    row: Number,
    column: Number,
    field: 'FormFeldExcelBericht',
    id: String,
    multirowAbstandZeile: Number,
    multicolAbstandSpalte: Number,

  })

  PojosMetadataMap.create<PouchKoordinaten>('PouchKoordinaten', {
    gkHoch: Number,
    gkRechts: Number
  })

  PojosMetadataMap.create<FormFeldExcelBericht>('FormFeldExcelBericht', {
    name: String,
    type: String
  })

  PojosMetadataMap.create<OverviewForm>('OverviewForm', {
    id: String,
    filename: String,
    lastModfied: String
  })

  PojosMetadataMap.create<PouchOverview>('PouchOverview', {
    id: String,
    filename: String,
    lastModfied: Number
  })

  PojosMetadataMap.create<MessgeraetForm>('MessgeraetForm', {
    name: String,
    seriennummer: String,
    offsetLines: String,
    id: String,
    hz31_5: Number,
    hz63: Number,
    hz125: Number,
    hz250: Number,
    hz500: Number,
    hz1000: Number,
    hz2000: Number,
    hz4000: Number,
    hz8000: Number,
  })

  PojosMetadataMap.create<ProjectForm>('ProjectForm', {
    id: String,
    dbName: String,
    name: String
  })

  PojosMetadataMap.create<PouchProject>('PouchProject', {
    id: String,
    dbName: String,
    name: String
  })

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



  PojosMetadataMap.create<GeometrieEmittent>('GeometrieEmittent', {
    id: String,
    geo1: Number,
    geo2: Number,
    geo3: Number,
    geo4: Number
  })


  PojosMetadataMap.create<Koordinaten>('Koordinaten', {
    id: String,
    gk_hoch: Number,
    gk_rechts: Number,
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

  PojosMetadataMap.create<PouchEmittentBackup>('PouchEmittent', {
    backsUp: String,
    data: 'PouchEmittent'
  })

  PojosMetadataMap.create<PouchEmittent>('PouchEmittent', {
    id: String,
    name: String,
    kostenstelle: String,
    anlage: String,
    bearbeiter: String,
    abteilung: String,
    messungen: 'PouchMessung',
    filename: String,
    messinstitut: String,
    liegtAnFassade: Boolean,
    fuerMessungVormerken: Boolean,
    inBetrieb: Boolean,
    bemerkung: String,
    luftschadstoffe: 'Luftschadstoffe'
    // lage: 'PouchKoordinatenHoehe'
  })

  PojosMetadataMap.create<PouchKoordinatenHoehe>('PouchKoordinatenHoehe', {
    gkHoch: Number,
    gkRechts: Number,
    hoehe: Number
  })



  PojosMetadataMap.create<Luftschadstoffe>('Luftschadstoffe', {
    messungen: ['Luftschadstoffmessung'],
    genehmigungen: ['Luftschadstoffgenehmigung']
  })

  PojosMetadataMap.create<LuftschadstoffMessung>('Luftschadstoffmessung', {
    id: String,
    bemerkung: String,
    datum: String,
    abluftkonzentration: Number,
    grenzwert: Number,
    massenstrom: Number,
    geruchsrelevanz: Boolean,
    gemessenerAbluftvolumenstrom: Number, //"m³"),
    genehmigterAbluftvolumenstrom: Number, // "m³"),
    austrittsgeschwindigkeitAbluft: Number,// "m/s"),
    ableitbedingungenErfüllt: Boolean, //true),
    abgastemperatur: Number, // "°C"),
    austrittsfläche: Number //  "m²"),

  })

  PojosMetadataMap.create<LuftschadstoffGenehmigung>('Luftschadstoffgenehmigung', {
    id: String,
    aktenzeichen: String,
    gueltigAb: String,
    gueltigBis: String,
    genehmigungsdatum: String,
    name: String,

    file: 'File',
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



  PojosMetadataMap.create<Emittent>('Emittent', {
    id: String,
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
    seriennummer: String,

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

  PojosMetadataMap.create<PouchVorlageExcelbericht>('PouchVorlageExcelbericht', {
    name: String,
    vorlage: Blob,
    filename: String,
    fields: ['PouchPositionFeldExcelBericht'],
    id: String
  })

  PojosMetadataMap.create<VorlageExcelbericht>('VorlageExcelbericht', {
    name: String,
    vorlage: Blob,
    fields: ['PositionFeldExcelBericht'],
    id: String
  })

  PojosMetadataMap.create<PouchPositionFeldExcelBericht>('PouchPositionFeldExcelBericht', {
    field: 'PouchFeldExcelBericht',
    row: Number,
    column: Number,
    id: String
  })

  PojosMetadataMap.create<PositionFeldExcelBericht>('PositionFeldExcelBericht', {
    field: 'FeldExcelBericht',
    row: Number,
    column: Number,
    id: String

  })

  PojosMetadataMap.create<FeldExcelBericht>('FeldExcelBericht', {
    name: String,
    type: String,


  })

  PojosMetadataMap.create<PouchFeldExcelBericht>('PouchFeldExcelBericht', {
    name: String,
    type: String,

  })

  PojosMetadataMap.create<LuftschadstoffeForm>('LuftschadstoffeForm', {
    id: String,
    bemerkung: String,
    datum: String,
    abluftkonzentration: Number,
    grenzwert: Number,
    massenstrom: Number,
    geruchsrelevanz: Boolean,
    gemessenerAbluftvolumenstrom: Number, //"m³"),
    genehmigterAbluftvolumenstrom: Number, // "m³"),
    austrittsgeschwindigkeitAbluft: Number,// "m/s"),
    ableitbedingungenErfüllt: Boolean, //true),
    abgastemperatur: Number, // "°C"),
    austrittsfläche: Number //  "m²"),
  })

  PojosMetadataMap.create<PouchLuftschadstoffmessung>('PouchLuftschadstoffmessung', {
    id: String,
    file: 'FileReference',
    grenzwert: Number,
    bemerkung: String,

    abgastemperatur: Number,
    ableitbedingungenErfüllt: Boolean,
    abluftkonzentration: Number,
    austrittsfläche: Number,
    austrittsgeschwindigkeitAbluft: Number,

    datum: Number,
    gemessenerAbluftvolumenstrom: Number,
    genehmigterAbluftvolumenstrom: Number,
    geruchsrelevanz: Boolean,
    massenstrom: Number,


  })

  PojosMetadataMap.create('FileReference', {
    name: String,
    referenz: String
  })

  PojosMetadataMap.create('PouchLuftschadstoffgenehmigung', {
    id: String,
    aktenzeichen: String,
    // file: 'FileReference',
    gueltigBis: Number,
    gueltigAb: Number,
    name: String,
    genehmigungsdatum: Number

  })

  PojosMetadataMap.create('GenehmigungForm', {
    id: String,
    aktenzeichen: String,
    gueltigBis: String,
    gueltigAb: String,
    name: String,
    genehmigungsdatum: String,
    // file: ['FileList']
  })


  PojosMetadataMap.create<KarteForm>('KarteForm', {
    id: String,
    // file: ['FileList']
    georeferenzierung: 'GeoreferenzierungForm',
    filename: String,

    roof: String,
    plant: String
  })

  PojosMetadataMap.create<GeoreferenzierungspunktForm>('GeoreferenzierungspunktForm', {
    gkRechts: Number,
    gkHoch: Number,
    pixelX: Number,
    pixelY: Number,
    id: String
  }
  )

  PojosMetadataMap.create<KoordinatenForm>('KoordinatenForm', {
    gkRechts: Number,
    gkHoch: Number,
  }
  )

  PojosMetadataMap.create<GeoreferenzierungForm>('GeoreferenzierungForm', {
    id: String,
    referenzierungspunkt_set: ['GeoreferenzierungspunktForm'],
    x00: Number,
    x01: Number,
    x02: Number,
    x10: Number,
    x11: Number,
    x12: Number,

    upperLeft: 'KoordinatenForm',
    upperRight: 'KoordinatenForm',
    lowerRight: 'KoordinatenForm',
    lowerLeft: 'KoordinatenForm',
    // file: ['FileList']
  })

  PojosMetadataMap.create<PouchMap>('PouchMap', {
    id: String,
    georeferenzierung: 'PouchGeoreferenzierung',
    filename: String,
    roof: String,
    plant: String
  })

  PojosMetadataMap.create<PouchGeoreferenzierung>('PouchGeoreferenzierung', {
    id: String,
    referenzierungspunkt_set: ['PouchGeoreferenzierungspunkt'],
    x00: Number,
    x01: Number,
    x02: Number,
    x10: Number,
    x11: Number,
    x12: Number,
    lower_left: 'PouchKoordinaten',
    lower_right: 'PouchKoordinaten',
    upper_right: 'PouchKoordinaten',
    upper_left: 'PouchKoordinaten'
  })

  PojosMetadataMap.create<PouchGeoreferenzierungspunkt>('PouchGeoreferenzierungspunkt', {
    gk_hoch: Number,
    gk_rechts: Number,
    pixel_x: Number,
    pixel_y: Number,
    id: String
  })


}

createUserMetadata();

export const mapper = createMapper({ strategyInitializer: pojos() });


function conditionalDateParser(arg: string | null) {
  console.log(arg)
  if (arg != null) {
    const parsedDate = new Date(arg)
    console.log('parsedDate', parsedDate)
    return parsedDate.getTime()

  } else return null

}

function conditionalDate2String(arg: number | null) {

  console.log(arg)
  if (arg != null) {
    const parsedDate = new Date(arg)
    console.log('parsedDate', parsedDate)
    return parsedDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })

  } else return null

}

createMap<SchallmessungForm, PouchMessung>(mapper, 'SchallmessungForm', 'PouchMessung')
createMap<PouchMessung, SchallmessungForm>(mapper, 'PouchMessung', 'SchallmessungForm')
createMap<SchallmessungForm, SchallmessungForm>(mapper, 'SchallmessungForm', 'SchallmessungForm')

createMap<EmittentDetailsForm, PouchKoordinatenHoehe>(mapper, 'EmittentDetailsForm', 'PouchKoordinatenHoehe')
createMap<PouchKoordinatenHoehe, EmittentDetailsForm>(mapper, 'PouchKoordinatenHoehe', 'EmittentDetailsForm',)

createMap<EmittentDetailsForm, PouchEmittent>(mapper, 'EmittentDetailsForm', 'PouchEmittent', forMember(dest => dest.lage, mapWith('PouchKoordinatenHoehe', 'EmittentDetailsForm', src => src)))
createMap<EmittentDetailsForm, EmittentDetailsForm>(mapper, 'EmittentDetailsForm', 'EmittentDetailsForm')
createMap<PouchEmittent, EmittentDetailsForm>(mapper, 'PouchEmittent', 'EmittentDetailsForm',
  forMember(i => i.gkRechts, mapFrom(src => src.lage.gkRechts)),
  forMember(i => i.gkHoch, mapFrom(src => src.lage.gkHoch)),
  forMember(i => i.hoehe, mapFrom(src => src.lage.hoehe)))

createMap<PouchVorlageExcelbericht, FormVorlageExcelbericht>(mapper, 'PouchVorlageExcelbericht', 'FormVorlageExcelbericht',
)

createMap<FormVorlageExcelbericht, PouchVorlageExcelbericht>(mapper, 'FormVorlageExcelbericht', 'PouchVorlageExcelbericht'
)

createMap<FormVorlageExcelbericht, FormVorlageExcelbericht>(mapper, 'FormVorlageExcelbericht', 'FormVorlageExcelbericht',
)

createMap<FormPositionFeldExcelBericht, FormPositionFeldExcelBericht>(mapper, 'FormPositionFeldExcelBericht', 'FormPositionFeldExcelBericht')

createMap<PouchPositionFeldExcelBericht, FormPositionFeldExcelBericht>(mapper, 'PouchPositionFeldExcelBericht', 'FormPositionFeldExcelBericht')

createMap<FormPositionFeldExcelBericht, PouchPositionFeldExcelBericht>(mapper, 'FormPositionFeldExcelBericht', 'PouchPositionFeldExcelBericht')

createMap<PouchFeldExcelBericht, FormFeldExcelBericht>(mapper, 'PouchFeldExcelBericht', 'FormFeldExcelBericht')

createMap<FormFeldExcelBericht, PouchFeldExcelBericht>(mapper, 'FormFeldExcelBericht', 'PouchFeldExcelBericht')


createMap<PouchOverview, OverviewForm>(mapper, 'PouchOverview', 'OverviewForm',
  forMember(dest => dest.lastModfied, mapFrom(src => conditionalDate2String(src.lastModfied)))
)

createMap<OverviewForm, PouchOverview>(mapper, 'OverviewForm', 'PouchOverview',
  forMember(dest => dest.lastModfied, mapFrom(src => conditionalDateParser(src.lastModfied)))
)

createMap<OverviewForm, OverviewForm>(mapper, 'OverviewForm', 'OverviewForm')

createMap<PouchMessgeraet, MessgeraetForm>(mapper, 'PouchMessgeraet', 'MessgeraetForm',
)

createMap<MessgeraetForm, PouchMessgeraet>(mapper, 'MessgeraetForm', 'PouchMessgeraet',
)

createMap<MessgeraetForm, MessgeraetForm>(mapper, 'MessgeraetForm', 'MessgeraetForm')

createMap<PouchProject, ProjectForm>(mapper, 'PouchProject', 'ProjectForm',
)

createMap<ProjectForm, ProjectForm>(mapper, 'ProjectForm', 'ProjectForm',
)

createMap<ProjectForm, PouchProject>(mapper, 'ProjectForm', 'PouchProject',
)

createMap<PouchMap, KarteDetails>(mapper, 'PouchMap', 'KarteDetails',
)

createMap<PouchGeoreferenzierung, Georeferenzierung>(mapper, 'PouchGeoreferenzierung', 'Georeferenzierung',
)

createMap<PouchGeoreferenzierungspunkt, Georeferenzierungspunkt>(mapper, 'PouchGeoreferenzierungspunkt', 'Georeferenzierungspunkt',

)

createMap<PouchGeoreferenzierung, GeoreferenzierungForm>(mapper, 'PouchGeoreferenzierung', 'GeoreferenzierungForm',
)

createMap<GeoreferenzierungForm, PouchGeoreferenzierung>(mapper, 'GeoreferenzierungForm', 'PouchGeoreferenzierung',
  forMember(i => i.lower_left, mapWith('KoordinatenForm', 'PouchKoordinaten', src => src.lowerLeft)),
  forMember(i => i.upper_left, mapWith('PouchKoordinaten', 'KoordinatenForm', src => src.upperLeft)),
  forMember(i => i.upper_right, mapWith('PouchKoordinaten', 'KoordinatenForm', src => src.upperRight)),
  forMember(i => i.lower_right, mapWith('PouchKoordinaten', 'KoordinatenForm', src => src.lowerRight)),
)

createMap<PouchGeoreferenzierungspunkt, GeoreferenzierungspunktForm>(mapper, 'PouchGeoreferenzierungspunkt', 'GeoreferenzierungspunktForm',
  forMember(dest => dest.gkHoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gkRechts, mapFrom(src => src.gk_rechts)),
  forMember(dest => dest.pixelX, mapFrom(src => src.pixel_x)),
  forMember(dest => dest.pixelY, mapFrom(src => src.pixel_y)),
)

createMap<GeoreferenzierungspunktForm, PouchGeoreferenzierungspunkt>(mapper, 'GeoreferenzierungspunktForm', 'PouchGeoreferenzierungspunkt',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gkHoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gkRechts)),
  forMember(dest => dest.pixel_x, mapFrom(src => src.pixelX)),
  forMember(dest => dest.pixel_y, mapFrom(src => src.pixelY)),
)

createMap<LuftschadstoffMessung, PouchLuftschadstoffmessung>(mapper, 'Luftschadstoffmessung', 'PouchLuftschadstoffmessung',
  forMember(dest => dest.file, mapFrom(src => {
    if (src.file != null) {
      return {
        name: src.file.name,
        referenz: src.id

      }
    } else {
      return null
    }
  })
  ),
  forMember(dest => dest.datum, mapFrom(src => conditionalDateParser(src.datum))

  ))



createMap<PouchLuftschadstoffmessung, LuftschadstoffMessung>(mapper, 'PouchLuftschadstoffmessung', 'Luftschadstoffmessung',
  forMember(dest => dest.datum, mapFrom(src => conditionalDate2String(src.datum)))
)


createMap<LuftschadstoffeForm, LuftschadstoffMessung>(mapper, 'LuftschadstoffeForm', 'Luftschadstoffmessung',
  forMember(dest => dest.file, mapFrom(src => {
    console.log('Mapper is called...')
    if (src.file.length > 0) {
      return {
        file: src.file[0],
        name: src.file[0].name
      }
    } else {
      return null
    }
  })),
)

createMap<LuftschadstoffMessung, LuftschadstoffeForm>(mapper, 'Luftschadstoffmessung', 'LuftschadstoffeForm',
)

createMap<LuftschadstoffGenehmigung, GenehmigungForm>(mapper, 'Luftschadstoffgenehmigung', 'GenehmigungForm',
)

createMap<GenehmigungForm, LuftschadstoffGenehmigung>(mapper, 'GenehmigungForm', 'Luftschadstoffgenehmigung',
  forMember(dest => dest.file, mapFrom(src => {
    if (src.file.length > 0) {
      return src.file[0]
    } else {
      return null
    }
  })),
)

createMap<LuftschadstoffGenehmigung, PouchLuftschadstoffgenehmigung>(mapper, 'Luftschadstoffgenehmigung', 'PouchLuftschadstoffgenehmigung',
  forMember(dest => dest.file, mapFrom(src => {
    if (src.file != null) {
      return {
        referenz: src.id,
        name: src.file?.name
      }
    } else return null
  })),
  forMember(dest => dest.gueltigBis, mapFrom(src => conditionalDateParser(src.gueltigBis)))
)

createMap<PouchLuftschadstoffgenehmigung, LuftschadstoffGenehmigung>(mapper, 'PouchLuftschadstoffgenehmigung', 'Luftschadstoffgenehmigung',
  forMember(dest => dest.gueltigBis, mapFrom(src => conditionalDate2String(src.gueltigBis)))
)

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



createMap<PouchMap, KarteForm>(mapper, 'PouchMap', 'KarteForm',
)
createMap<KarteForm, KarteForm>(mapper, 'KarteForm', 'KarteForm',
)
createMap<KarteForm, PouchMap>(mapper, 'KarteForm', 'PouchMap',
)

createMap<VorlageExcelbericht, PouchVorlageExcelbericht>(mapper, 'VorlageExcelbericht', 'PouchVorlageExcelbericht')

createMap<PouchVorlageExcelbericht, VorlageExcelbericht>(mapper, 'PouchVorlageExcelbericht', 'VorlageExcelbericht')

createMap<PositionFeldExcelBericht, PouchPositionFeldExcelBericht>(mapper, 'PositionFeldExcelBericht', 'PouchPositionFeldExcelBericht')

createMap<PouchPositionFeldExcelBericht, PositionFeldExcelBericht>(mapper, 'PouchPositionFeldExcelBericht', 'PositionFeldExcelBericht')

createMap<FeldExcelBericht, PouchFeldExcelBericht>(mapper, 'FeldExcelBericht', 'PouchFeldExcelBericht')

createMap<PouchFeldExcelBericht, FeldExcelBericht>(mapper, 'PouchFeldExcelBericht', 'FeldExcelBericht')









createMap<Pegelreihe, Pegelreihe>(
  mapper, 'Messwertereihe', 'Messwertereihe'
)

createMap<Messung, Messung>(
  mapper,
  'Messung',
  'Messung',
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
  forMember(src => src.discriminator, mapFrom(() => 'plant')),
  // forMember(src => src.map, mapWith('KarteDetails', 'KarteApi', src => src.map)),
)

createMap<Building, PouchBuilding>(mapper, 'Building', 'PouchBuilding',
  forMember(src => src.name, mapFrom(dest => dest.name)),
  forMember(src => src.id, mapFrom(dest => dest.id)),
  forMember(src => src.discriminator, mapFrom(() => 'building')),
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
  forMember(src => src.discriminator, mapFrom(() => 'roof')),
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
  forMember(dest => dest.gkHoch, mapFrom(src => src.gk_hoch)),
  forMember(dest => dest.gkRechts, mapFrom(src => src.gk_rechts))

)

createMap<KoordinatenForm, PouchKoordinaten>(mapper, 'KoordinatenForm', 'PouchKoordinaten',)
createMap<PouchKoordinaten, KoordinatenForm>(mapper, 'PouchKoordinaten', 'KoordinatenForm')

createMap<PouchKoordinaten, Koordinaten>(mapper, 'PouchKoordinaten', 'Koordinaten',
  forMember(dest => dest.gk_hoch, mapFrom(src => src.gkHoch)),
  forMember(dest => dest.gk_rechts, mapFrom(src => src.gkRechts))
)

createMap<KoordinatenHoehe, PouchKoordinatenHoehe>(mapper, 'KoordinatenHoehe', 'PouchKoordinatenHoehe',
  forMember(dest => dest.gkHoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gkRechts, mapFrom(src => src.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))

)

createMap<PouchKoordinatenHoehe, KoordinatenHoehe>(mapper, 'PouchKoordinatenHoehe', 'KoordinatenHoehe',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gkHoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gkRechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))
)

createMap<EmittentDetails, PouchKoordinatenHoehe>(mapper, 'EmittentDetails', 'PouchKoordinatenHoehe',
  forMember(dest => dest.gkHoch, mapFrom(src => src.gkhoch)),
  forMember(dest => dest.gkRechts, mapFrom(src => src.gkrechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))
)

createMap<PouchKoordinatenHoehe, EmittentDetails>(mapper, 'PouchKoordinatenHoehe', 'EmittentDetails',
  forMember(dest => dest.gkhoch, mapFrom(src => src.gkHoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.gkRechts)),
  forMember(dest => dest.hoehe, mapFrom(src => src.hoehe))
)


createMap<PouchEmittent, EmittentDetails>(mapper, 'PouchEmittent', 'EmittentDetails',
  forMember(dest => dest.name, mapFrom(src => src.name)),
  forMember(dest => dest.gkhoch, mapFrom(src => src.lage.gkHoch)),
  forMember(dest => dest.gkrechts, mapFrom(src => src.lage.gkRechts)),
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
  forMember(dest => dest.datum, mapFrom(src => new Date(src.datum).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })))
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


