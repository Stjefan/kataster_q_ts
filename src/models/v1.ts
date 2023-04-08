
import * as Factory from 'factory.ts';
import { random } from 'lodash';
import { v4 as uuidv4 } from 'uuid'
export interface Pegelreihe {
  [state: string]: unknown

  hz31_5: number;
  hz63: number
  hz125: number
  hz250: number
  hz500: number
  hz1000: number
  hz2000: number
  hz4000: number
  hz8000: number
  id: string
  idOnBackend: number | null

}

const USE_DEVELOPMENT_DATA = false

export interface OverviewFile {
  id: string
  upload: string
  filename: string
}

export interface LuftschadstoffGenehmigung {
  id: string
  name: string
  gueltigAb: string | null
  gueltigBis: string | null
  file: File | null,
  genehmigungsdatum: string | null
  aktenzeichen: string | null
}

export interface LuftschadstoffMessung {
  id: string,
  bemerkung: string
  datum: string | null
  abluftkonzentration: number | null,
  grenzwert: number | null,
  massenstrom: number | null,
  file: any | null,
  geruchsrelevanz: boolean | null
  gemessenerAbluftvolumenstrom: number | null  //"m³"),
  genehmigterAbluftvolumenstrom: number | null // "m³"),
  austrittsgeschwindigkeitAbluft: number | null// "m/s"),
  ableitbedingungenErfüllt: boolean | null//true),
  abgastemperatur: number | null// "°C"),
  austrittsfläche: number | null//  "m²"),
}

export interface Luftschadstoffe {
  genehmigungen: LuftschadstoffGenehmigung[]
  messungen: LuftschadstoffMessung[]
}

export interface Korrekturwert {
  lw1: number
  bemerkung: string | null,
  korrekturen: number[]
  bemerkungen: string[]
}

export function getField(arg: Pegelreihe, field: string) {
  switch (field) {
    case 'hz31_5':
      return arg.hz31_5
    case 'hz63': return arg.hz63
    case 'hz125': return arg.hz125
    case 'hz250': return arg.hz250
    case 'hz500': return arg.hz500
    case 'hz1000': return arg.hz1000
    case 'hz2000': return arg.hz2000
    case 'hz4000': return arg.hz4000
    case 'hz8000': return arg.hz8000
    default: throw new Error('Invalid argument')
  }

}

export function setField(arg: Pegelreihe, field: string, value: number) {
  switch (field) {
    case 'hz31_5':
      arg.hz31_5 = value
      break
    case 'hz63': arg.hz63 = value
      break;
    case 'hz125': arg.hz125 = value
      break;

    case 'hz250': arg.hz250 = value
      break
    case 'hz500': arg.hz500 = value
      break
    case 'hz1000': arg.hz1000 = value
      break
    case 'hz2000': arg.hz2000 = value
      break
    case 'hz4000': arg.hz4000 = value
      break
    case 'hz8000': arg.hz8000 = value
      break
    default: throw new Error(`Invalid argument: ${field}`)
  }

}


export const pegelfrequenzenFields = ['hz31_5', 'hz63', 'hz125', 'hz250', 'hz500', 'hz1000', 'hz2000', 'hz4000', 'hz8000']

export const ein_punkt_messverfahren = ['Quadermessung an 1 reflektierenden Ebene',
  'Quadermessung an 2 reflektierenden Ebenen',
  'Quadermessung an 3 reflektierenden Ebenen',
  'Kugelmessung (default)',
  'Innerhalb einer eckigen Fläche',
  'Innerhalb einer rahmen Fläche',
  'Innerhalb einer Kreisfläche',
  'Innerhalb einer Kreisringfläche',
  'Außerhalb einer eckigen Fläche',
  'Außerhalb einer rahmen Fläche',
  'Außerhalb einer Kreisfläche',
  'Außerhalb einer Kreisringfläche',
  'Innenpegel',]

export const kamin_messverfahren = ['Kaminmessung (eckig)', 'Kaminmessung (rund)']
export const vier_punkt_messverfahren = ['Kühler an Kante']
export const fuenf_punkt_messverfahren = ['Kühler an Fläche']
export const drei_punkt_messverfahren = ['Kühlturmmessung']
export const verfuegbareMessverfahren = ein_punkt_messverfahren.concat(kamin_messverfahren).concat(vier_punkt_messverfahren).concat(fuenf_punkt_messverfahren).concat(drei_punkt_messverfahren)
export function* ascendingFrequences(arg: Pegelreihe) {
  yield arg.hz31_5;
  yield arg.hz63;
  yield arg.hz125;
  yield arg.hz250;
  yield arg.hz500;
  yield arg.hz1000;
  yield arg.hz2000;
  yield arg.hz4000;
  yield arg.hz8000;

}


export interface Koordinaten {
  gk_rechts: number,
  gk_hoch: number,
  pixel_x: number,
  pixel_y: number
  id: string
  idAtBackend: number | null
}

export interface Projekt {
  name: string,
  id: string,
  dbName: string
}

export interface Vorlage {
  name: string,
  id: string,
  idAtBackend: number | null
}

export interface FeldExcelBericht {
  name: string
  type: string
}

export interface PositionFeldExcelBericht {
  row: number
  column: number
  field: FeldExcelBericht
  id: string
  multirowAbstandZeile?: number
  multicolAbstandSpalte?: number
}

export interface VorlageExcelbericht {
  vorlage?: File

  name: string
  id: string

  fields: PositionFeldExcelBericht[]
}


export interface Messgeraet {
  name: string,
  id: string
  offsetLines: number
  seriennummer: string
  idAtBackend: number | null
  hz31_5: number | null;
  hz63: number | null
  hz125: number | null
  hz250: number | null
  hz500: number | null
  hz1000: number | null
  hz2000: number | null
  hz4000: number | null
  hz8000: number | null

}

export function createExpectedCols(m: Messgeraet) {
  const result = []
  if (m.hz31_5) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz31_5', col: m.hz31_5, name: 'hz31_5' }))
  }
  if (m.hz63) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz63', col: m.hz63, name: 'hz63' }))
  }
  if (m.hz125) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz125', col: m.hz125, name: 'hz125' }))
  }
  if (m.hz250) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz250', col: m.hz250, name: 'hz250' }))
  }
  if (m.hz500) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz500', col: m.hz500, name: 'hz500' }))
  }
  if (m.hz1000) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz1000', col: m.hz1000, name: 'hz1000' }))
  }
  if (m.hz2000) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz2000', col: m.hz2000, name: 'hz2000' }))
  }
  if (m.hz4000) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz4000', col: m.hz4000, name: 'hz4000' }))
  }
  if (m.hz8000) {
    result.push(excelFieldImportFactory.build({ maps_to: 'hz8000', col: m.hz8000, name: 'hz8000' }))
  }
  return result
}
// const expectedCols = ['hz31_5', 'hz63', 'hz125', 'hz250', 'hz500', 'hz1000', 'hz2000', 'hz4000', 'hz8000'].map((i, ix) => excelFieldImportFactory.build({ maps_to: i, col: myMessgeraet, name: i }))


export interface Auswertungspegelreihe {
  summiert: number
}

export interface Anlagenpegelreihe {
  korrektur: number
}

export interface AuswertungDefault {
  mittelungspegel_gesamt: Pegelreihe[]
  mittelungspegel_fremd: Pegelreihe[]
  anlagenpegel: (Pegelreihe & Anlagenpegelreihe)[]

  korrekturwerte: number[]

  lwlin: Pegelreihe & Auswertungspegelreihe
  lwa: Pegelreihe & Auswertungspegelreihe,
  id: string,
}

export interface MesspunktAnAnlage {
  fremdpegel: Pegelreihe
  gesamtpegel: Pegelreihe

  metainfoFremdpegel: Metainfo
  metainfoGesamtpegel: Metainfo
  id: string

  fremdpegelVorhanden: boolean

}


export interface ExcelFieldImport {
  name: string
  col: number
  row: number
  maps_to: string
  id: string

}

export interface ExcelFieldExport {
  name: string
  col: number
  row: number
  maps_from: string
}



export interface MesswertereiheDTO {
  hz31_5: number;
  hz63: number;
  additional: string
}

export interface EmittentSnapshot {
  id: string,
  datum: string,
  kommentar: string
}

export interface Georeferenzierungspunkt {
  gkRechts: number
  gkHoch: number
  pixelX: number
  pixelY: number
  id: string
}

export interface Metainfo {
  name_messfile: string
  messdatum: string
  overviewfile: string | null
  messgeraet: string | null | undefined
  id: string
}

export interface GK2PxMatrix {
  translation: number[][]
  matrix: number[][]
}

export interface Georeferenzierung {
  referenzierungspunkt_set: Georeferenzierungspunkt[]
  x00: number
  x01: number
  x02: number
  x10: number
  x11: number
  x12: number
  id: string

  upper_left: Koordinaten
  upper_right: Koordinaten
  lower_right: Koordinaten
  lower_left: Koordinaten

}

export interface KarteDetails {
  url: string
  georeferenzierung?: Georeferenzierung
  id: string | number

  zuordnung?: string,
  idAtBackend: number | null

}



export interface AuswertungDTO {
  id: string
  korrektur_anlage1: number
  anlagenpegel_1: MesswertereiheDTO

  lwa: MesswertereiheDTO
  lwlin: MesswertereiheDTO
}
/*
export interface Messposition {
  fremdpegel: Pegelreihe
  gesamtpegel: Pegelreihe
  fremdpegel_vorhanden: boolean
  id: string
}
*/

export interface MesspositionDTO {
  fremdpegel: Pegelreihe
  gesamtpegel: Pegelreihe
}

// needs extra row for fremd und gesamtpegel
export interface MesspositionEditViewModel {
  messwertereihen: (MesspunktAnAnlage)[]
  id: string
  // geometrie_emittent: GeometrieEmittent,
  // geometrie_messung: GeometrieMessung

}


export interface Messung {
  id: string,
  datum: string,

  geometrie_emittent: GeometrieEmittent,
  geometrie_messung: GeometrieMessung

  messpositionen: MesspositionEditViewModel[]

  auswertung: AuswertungDefault | null

  type: string

  messverfahren: string

}

export interface Plant {
  id: string,
  name: string,
  children: Building[],
  header: string
  body: string
  map: KarteDetails
  // project_id: number,
  idAtBackend: number | null,
}

export interface Building {
  id: string,
  name: string,
  children: Roof[],
  header: string
  body: string,
  parent: string,
  idAtBackend: number | null
}

export interface Roof {
  id: string,
  name: string,
  children: Emittent[]
  header: string
  body: string
  map: KarteDetails
  parent: string,
  idAtBackend: number | null
}

export interface Emittent {
  id: string,
  name: string
  header: string
  body: string
  koordinaten: Koordinaten
  parent: string,
  messungen: Messung[],
}

export interface EmittentFilterresult {
  id: string,
  name: string
  koordinaten: Koordinaten
  gkrechts: number | null,
  gkhoch: number | null,
  parent: string
  idAtBackend: number | null,
  checked: boolean
}

export interface EmittentDetails {
  id: string
  name: string
  gkrechts: number
  gkhoch: number
  hoehe: number
  bemerkung: string
  messungen: Messung[]
  picture: string

  bearbeiter: string,
  kostenstelle: string,
  abteilung: string,
  messinstitut: string,
  anlage: string,
  created: string,
  modified: string,
  in_betrieb: boolean,
  fuer_messung_vormerken: boolean,
  liegt_an_fassade: boolean,

  idAtBackend: number | null,
  luftschadstoffe: Luftschadstoffe

}


export interface GeometrieMessung {
  geoxy: number
  geoh: number
  k2a: number // Umgebungskorrektur
  komega: number // Zuschlag für reflektierende Flächen,
  id: string
}

export interface GeometrieEmittent {
  geo1: number
  geo2: number
  geo3: number
  geo4: number
  id: string
}

export interface PointOnMap {
  pixel_x: number
  pixel_y: number
  id: string,
  idCorrespondingEmittent: string | null
}

export interface RectOnMap {
  points: string
  id: string,
  idCorrespondingRoof: number | null,
  nameCorrespondingRoof: string | null
}

const pointOnMapFactory = Factory.Sync.makeFactory<PointOnMap>({
  id: Factory.each((i) => `P${i}`),
  pixel_x: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
  pixel_y: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
  idCorrespondingEmittent: null

})

const rectOnMapFactory = Factory.Sync.makeFactory<RectOnMap>({
  idCorrespondingRoof: null,
  nameCorrespondingRoof: null,
  id: Factory.each((i) => `P${i}`),
  points: Factory.each(() => `${(Math.floor(Math.random() * 10000) / 100)}, ${(Math.floor(Math.random() * 10000) / 100)}, ${(Math.floor(Math.random() * 10000) / 100)}, ${(Math.floor(Math.random() * 10000) / 100)}, ${(Math.floor(Math.random() * 10000) / 100)}, ${(Math.floor(Math.random() * 10000) / 100)}`),

})

const messwertereiheFactory = Factory.Sync.makeFactory<Pegelreihe>(
  USE_DEVELOPMENT_DATA ? {
    id: Factory.each((i) => `${i}`),
    hz31_5: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz63: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz125: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz250: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz500: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz1000: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz2000: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz4000: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
    hz8000: Factory.each(() => Math.floor(Math.random() * 10000) / 100),
  } : {
    id: Factory.each((i) => `${i}`),
    hz31_5: 0,
    hz63: 0,
    hz125: 0,
    hz250: 0,
    hz500: 0,
    hz1000: 0,
    hz2000: 0,
    hz4000: 0,
    hz8000: 0,
  }
);

/*
const messpositionFactory = Factory.Sync.makeFactory<Messposition>({
  id: Factory.each((i) => `${i}`),
  fremdpegel: messwertereiheFactory.build(),
  gesamtpegel: messwertereiheFactory.build(),
  fremdpegel_vorhanden: Factory.each((i) => false),
});
*/
const _messungFactory = Factory.Async.makeFactoryWithRequired<Messung, 'type'>({
  id: Factory.Async.each((i) => uuidv4()),
  datum: Factory.Async.each(() => new Date().toISOString()),
  messpositionen: Factory.Async.each(() => []),
  geometrie_messung: Factory.Async.each(() => geometrieMessungFactory.build()),
  geometrie_emittent: Factory.Async.each(() => geometrieEmittentFactory.build()),
  messverfahren: '',
  auswertung: null,
});



const messungFactory = _messungFactory.transform(obj => {
  switch (obj.type) {


    case '1P':
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      //obj.messverfahren = obj.messverfahren
      return obj
    /*
    case '2P':
      obj.messpositionen.set(1, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(2, messpositionEditViewModelFactory.build())

      return obj
            */
    case '3P':
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      //obj.messverfahren = drei_punkt_messverfahren[random(0, drei_punkt_messverfahren.length - 1)]
      return obj

    case '4P':
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      //obj.messverfahren = vier_punkt_messverfahren[random(0, vier_punkt_messverfahren.length - 1)]
      return obj
    case '5P':
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      obj.messpositionen.push(messpositionEditViewModelFactory.build())
      //obj.messverfahren = fuenf_punkt_messverfahren[random(0, fuenf_punkt_messverfahren.length - 1)]
      return obj
  }
})

const georeferenzpunktFactory = Factory.Sync.makeFactory<Georeferenzierungspunkt>({
  gkHoch: 1,
  gkRechts: 2,
  pixelX: Factory.each((i) => Math.floor(Math.random() * 900)),
  pixelY: Factory.each((i) => Math.floor(Math.random() * 900)),
  id: Factory.each((i) => `${i}`),
})

const georeferenzierungFactory = Factory.Sync.makeFactory<Georeferenzierung>({
  referenzierungspunkt_set: georeferenzpunktFactory.buildList(3),
  x00: 0,
  x01: 1,
  x02: 0,
  x10: 0,
  x11: 0,
  x12: 1,
  id: Factory.each((i) => `${i}`),
  upper_left: Factory.each(() => koordinatenFactory.build()),
  upper_right: Factory.each(() => koordinatenFactory.build()),
  lower_right: Factory.each(() => koordinatenFactory.build()),
  lower_left: Factory.each(() => koordinatenFactory.build()),
})



const excelFieldImportFactory = Factory.Sync.makeFactoryWithRequired<ExcelFieldImport, 'maps_to'>({
  id: Factory.each((i) => `${i}`),
  row: Factory.each((i) => i),
  col: Factory.each((i) => i),
  name: 'Hz31.5'
})


const koordinatenFactory = Factory.Sync.makeFactory<Koordinaten>({
  gk_hoch: 1,
  gk_rechts: 2,
  pixel_x: Factory.each((i) => Math.floor(Math.random() * 900)),
  pixel_y: Factory.each((i) => Math.floor(Math.random() * 900)),
  id: Factory.each((i) => `${i}`),
  idAtBackend: null
})

const plantFactory = Factory.Sync.makeFactory<Plant>({
  id: Factory.each((i) => `P${i}`),
  name: Factory.each((i) => `${i}`),
  children: Factory.each(() => buildingFactory.buildList(Math.max(1, Math.floor(Math.random() * 4)), { parent: 'P4' })),
  header: 'werk',
  body: 'werk',
  map: Factory.each((i) => karteDetailsFactory.build()),
  idAtBackend: null

})

const buildingFactory = Factory.Sync.makeFactoryWithRequired<Building, 'parent'>({
  id: Factory.each((i) => `B${i}`),
  name: Factory.each((i) => `${i}`),
  children: Factory.each(() => roofFactory.buildList(Math.max(1, Math.floor(Math.random() * 4)), { parent: 'B12' })),
  header: 'gebaeude',
  body: 'gebaeude',
  idAtBackend: null
})

const roofFactory = Factory.Sync.makeFactoryWithRequired<Roof, 'parent'>({
  id: Factory.each((i) => `R${i}`),
  name: Factory.each((i) => `${i}`),
  children: Factory.each(() => emittentFactory.buildList(Math.max(1, Math.floor(Math.random() * 4)), { parent: 'R54' })),
  header: 'dach',
  body: 'dach',
  map: Factory.each((i) => karteDetailsFactory.build()),
  idAtBackend: null
})

const emittentFactory = Factory.Sync.makeFactoryWithRequired<Emittent, 'parent'>({
  id: Factory.each((i) => `E${i}`),
  name: Factory.each((i) => `${i}`),
  header: 'emittent',
  body: 'emittent',
  koordinaten: Factory.each(() => koordinatenFactory.build()),
  messungen: Factory.each(() => [])
})


const metainfoFactory = Factory.Sync.makeFactory<Metainfo>({
  name_messfile: Factory.each((i) => `M${i}`),
  messgeraet: Factory.each((i) => null),
  messdatum: '2022-01-01',
  id: Factory.each((i) => `E${i}`),
  overviewfile: Factory.each((i) => null),

})



const anlagenpegelFactory: Factory.Sync.Factory<Anlagenpegelreihe & Pegelreihe> = Factory.Sync.makeFactory({
  korrektur: 3
}).combine(messwertereiheFactory)

const auswertungspegelFactory: Factory.Sync.Factory<Auswertungspegelreihe & Pegelreihe> = Factory.Sync.makeFactory({
  summiert: 43
}).combine(messwertereiheFactory)

const messpunktAnAnlageFactory = Factory.Sync.makeFactory<MesspunktAnAnlage>({
  id: Factory.each((i) => `M${i}`),
  metainfoFremdpegel: Factory.each(() => metainfoFactory.build()),
  metainfoGesamtpegel: Factory.each(() => metainfoFactory.build()),
  fremdpegelVorhanden: Factory.each(() => random() >= 0.5),
  fremdpegel: Factory.each((i) => messwertereiheFactory.build()),
  gesamtpegel: Factory.each((i) => messwertereiheFactory.build()),

})

export const snapshotFactory = Factory.Sync.makeFactory<EmittentSnapshot>({
  id: Factory.each((i) => `S${i}`),
  datum: '2022-12-03',
  kommentar: 'abcdewf'

})

export const karteDetailsFactory = Factory.Sync.makeFactory<KarteDetails>({
  url: Factory.each((i) => `https://placeimg.com/${(Math.floor(Math.random() * 5) + 3) * 100}/${(Math.floor(Math.random() * 5) + 3) * 100}/nature?t=` + Math.random()),
  georeferenzierung: Factory.each(() => georeferenzierungFactory.build()),
  id: Factory.each((i) => `K${i}`),
  zuordnung: 'blub',
  idAtBackend: null

})
export const geometrieEmittentFactory = Factory.Sync.makeFactory<GeometrieEmittent>({
  geo1: 1,
  geo2: 2,
  geo3: 3,
  geo4: 4,
  id: Factory.each((i) => `M${i}`)
})

export const geometrieMessungFactory = Factory.Sync.makeFactory<GeometrieMessung>({
  geoxy: 1,
  geoh: 2,
  k2a: 3,
  komega: 4,
  id: Factory.each((i) => `M${i}`)
})

export const emittentDetailsFactory = Factory.Sync.makeFactory<EmittentDetails>({
  id: Factory.Sync.each((i) => `${i}`),
  name: Factory.Sync.each((i) => `E${i}`),
  picture: Factory.Sync.each(() => ''),
  bearbeiter: Factory.Sync.each(() => ''),
  kostenstelle: Factory.Sync.each(() => ''),
  abteilung: Factory.Sync.each(() => ''),
  messinstitut: Factory.Sync.each(() => ''),
  anlage: Factory.Sync.each(() => ''),
  created: Factory.Sync.each(() => '2022-01-01'),
  modified: Factory.Sync.each(() => '2022-01-02'),
  in_betrieb: Factory.Sync.each(() => true),
  fuer_messung_vormerken: Factory.Sync.each(() => false),
  liegt_an_fassade: Factory.Sync.each(() => false),
  gkrechts: 1,
  gkhoch: 2,
  hoehe: 3,
  bemerkung: '',
  messungen: Factory.Sync.each(() => []),
  idAtBackend: null,
  luftschadstoffe: Factory.Sync.each(() => luftschadstoffeFactory.build())
})

export const filterResultFactory = Factory.Sync.makeFactory<EmittentFilterresult>({
  id: Factory.each((i) => `E${i}`),
  name: Factory.each((i) => `${i}`),
  gkhoch: null,
  gkrechts: null,
  koordinaten: Factory.each(() => koordinatenFactory.build()),
  idAtBackend: null,
  parent: 'X10',
  checked: true

})



const messpositionEditViewModelFactory = Factory.Sync.makeFactory<MesspositionEditViewModel>({
  messwertereihen: Factory.each(() => messpunktAnAnlageFactory.buildList(1)),
  id: Factory.each((i) => `S${i}`)
  // geometrie_emittent: geometrieEmittentFactory.build(),
  // geometrie_messung: geometrieMessungFactory.build()
})

const auswertungFactory = Factory.Sync.makeFactory<AuswertungDefault>({
  lwa: Factory.each(() => auswertungspegelFactory.build()),
  lwlin: Factory.each(() => auswertungspegelFactory.build()),
  anlagenpegel: Factory.each(() => anlagenpegelFactory.buildList(2)),
  mittelungspegel_gesamt: Factory.each(() => messwertereiheFactory.buildList(2)),
  mittelungspegel_fremd: Factory.each(() => messwertereiheFactory.buildList(2)),
  id: Factory.each((i) => `A${i}`),
  korrekturwerte: Factory.each(() => [])
})

const projectFactory = Factory.Sync.makeFactory<Projekt>({
  name: Factory.each((i) => `Projekt ${i}`),
  id: Factory.each((i) => uuidv4()),
  dbName: Factory.each((i) => `P${i}`)
})

const messgeraetFactory = Factory.Sync.makeFactory<Messgeraet>({
  name: Factory.each((i) => `Messgerät ${i}`),
  id: Factory.each((i) => uuidv4()),
  offsetLines: 3,
  seriennummer: 'NOR118_5989863',
  idAtBackend: null,
  hz31_5: Factory.each(() => 10),
  hz63: Factory.each(() => 11),
  hz125: Factory.each(() => 12),
  hz250: Factory.each(() => 13),
  hz500: Factory.each(() => 14),
  hz1000: Factory.each(() => 15),
  hz2000: Factory.each(() => 16),
  hz4000: Factory.each(() => 17),
  hz8000: Factory.each(() => 18),
})

const vorlageFactory = Factory.Sync.makeFactory<Vorlage>({
  name: Factory.each((i) => `Vorlage ${i}`),
  id: Factory.each((i) => `V${i}`),
  idAtBackend: null
})

const korrekturwertFactory = Factory.Sync.makeFactory<Korrekturwert>({
  korrekturen: Factory.each((i) => []),
  lw1: 0,
  bemerkung: null,
  bemerkungen: []
})

const genehmigungFactory = Factory.Sync.makeFactory<LuftschadstoffGenehmigung>({
  id: Factory.each((i) => uuidv4()),
  name: 'X',
  genehmigungsdatum: Factory.each((i) => new Date().toISOString()),
  aktenzeichen: 'XY',
  gueltigAb: Factory.each((i) => new Date().toISOString()),
  gueltigBis: Factory.each((i) => new Date().toISOString()),
  file: null
})

const luftschaffMessungFactory = Factory.Sync.makeFactory<LuftschadstoffMessung>({
  id: Factory.each((i) => uuidv4()),
  bemerkung: 'Y',
  datum: Factory.each((i) => new Date().toISOString()),
  abluftkonzentration: null,
  grenzwert: null,
  massenstrom: null,
  geruchsrelevanz: null,
  gemessenerAbluftvolumenstrom: null,  //"m³"),
  genehmigterAbluftvolumenstrom: null, // "m³"),
  austrittsgeschwindigkeitAbluft: null,// "m/s"),
  ableitbedingungenErfüllt: null,//true),
  abgastemperatur: null,// "°C"),
  austrittsfläche: null,//  "m²"),
  file: null
})
const luftschadstoffeFactory = Factory.Sync.makeFactory<Luftschadstoffe>({
  genehmigungen: Factory.each((i) => []),
  messungen: Factory.each((i) => []),
})

const excelTemplateFactory = Factory.Sync.makeFactory<VorlageExcelbericht>({
  fields: Factory.each((i) => []),
  id: Factory.each((i) => uuidv4()),
  name: Factory.each((i) => 'TEST'),
})

export {
  excelTemplateFactory,
  uuidv4,
  luftschaffMessungFactory,
  genehmigungFactory,
  luftschadstoffeFactory,
  korrekturwertFactory,
  projectFactory,
  vorlageFactory,
  messgeraetFactory,
  auswertungFactory,
  auswertungspegelFactory,
  anlagenpegelFactory,
  metainfoFactory,
  messpositionEditViewModelFactory,
  messwertereiheFactory,
  // messpositionFactory,
  messungFactory,
  georeferenzpunktFactory,
  georeferenzierungFactory,
  plantFactory,
  buildingFactory,
  roofFactory,
  emittentFactory,
  messpunktAnAnlageFactory,
  pointOnMapFactory,
  rectOnMapFactory,
  excelFieldImportFactory,
  koordinatenFactory,

}


