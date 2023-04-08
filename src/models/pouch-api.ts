import { Luftschadstoffe } from 'src/models/v1'
export interface PouchPlant {
  id: string,
  name: string,
  discriminator: string
  map: PouchMap
}


export interface PouchBuilding {
  id: string,
  name: string,
  plant: string,
  discriminator: string
}

export interface PouchRoof {
  id: string,
  name: string,
  building: string
  map: PouchMap
  discriminator: string

}

export interface PouchEmittentBackup {
  backsUp: string,
  data: PouchEmittent,
}

export interface PouchEmittent {
  id: string,
  name: string,
  discriminator: string
  roof: string
  lage: PouchKoordinatenHoehe,

  bemerkung: string
  messungen: PouchMessung[]
  filename: Blob

  bearbeiter: string,
  kostenstelle: string,
  abteilung: string,
  messinstitut: string,
  anlage: string,
  created: string,
  modified: string,
  inBetrieb: boolean,
  fuerMessungVormerken: boolean,
  liegtAnFassade: boolean,
  luftschadstoffe: Luftschadstoffe
}

export interface PouchMessung {
  id: string,
  datum: number,

  geometrie_emittent: PouchGeometrieEmittent,
  geometrie_messung: PouchGeometrieMessung

  messpositionen: PouchMessposition[]

  auswertung: PouchAuswertung | null

  type: string

  messverfahren: string

}

export interface PouchAuswertungspegelreihe {
  summiert: number
}

export interface PouchAnlagenpegelreihe {
  korrektur: number
}

export interface PouchAuswertung {
  korrekturwerte: number[]
  winkelfehler: number

  mittelungspegel_gesamt: PouchPegelreihe[]
  mittelungspegel_fremd: PouchPegelreihe[]
  anlagenpegel: (PouchPegelreihe & PouchAnlagenpegelreihe)[]

  lwlin: PouchPegelreihe & PouchAuswertungspegelreihe
  lwa: PouchPegelreihe & PouchAuswertungspegelreihe,
  id: string,
}

export interface PouchPegelreihe {

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

}

export interface PouchMesspunktAnAnlage {
  fremdpegel: PouchPegelreihe
  gesamtpegel: PouchPegelreihe

  metainfoFremdpegel: PouchMetainfo
  metainfoGesamtpegel: PouchMetainfo
  id: string

  fremdpegelVorhanden: boolean

}


export interface PouchMessposition {
  messwertereihen: (PouchMesspunktAnAnlage)[]
  id: string
  // geometrie_emittent: GeometrieEmittent,
  // geometrie_messung: GeometrieMessung

}

export interface PouchGeometrieMessung {
  geoxy: number
  geoh: number
  k2a: number // Umgebungskorrektur
  komega: number // Zuschlag für reflektierende Flächen,
  id: string
}

export interface PouchGeometrieEmittent {
  geo1: number
  geo2: number
  geo3: number
  geo4: number
  id: string
}

export interface PouchGeoreferenzierungspunkt {
  gk_rechts: number
  gk_hoch: number
  pixel_x: number
  pixel_y: number
  id: string
}

export interface PouchOverview {
  filename: string
  id: string
  lastModfied: number
}

export interface PouchMetainfo {
  name_messfile: string
  messdatum: string
  overviewfile: string
  messgeraet: string | null | undefined
  id: string
}

export interface GK2PxMatrix {
  translation: number[][]
  matrix: number[][]
}

export interface PouchGeoreferenzierung {
  referenzierungspunkt_set: PouchGeoreferenzierungspunkt[]
  x00: number
  x01: number
  x02: number
  x10: number
  x11: number
  x12: number
  id: string

  upper_left: PouchKoordinaten
  upper_right: PouchKoordinaten
  lower_right: PouchKoordinaten
  lower_left: PouchKoordinaten

}

export interface PouchMap {
  url: string
  georeferenzierung?: PouchGeoreferenzierung
  id: string

  filename: string

  roof: string | null,
  plant: string | null,
  image: Blob | null

}

export interface PouchKoordinaten {
  gkRechts: number
  gkHoch: number
}

export interface PouchKoordinatenHoehe extends PouchKoordinaten {

  hoehe: number
}

export interface PouchMessgeraet {
  name: string,
  id: string
  offsetLines: number | null
  seriennummer: string | null
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

export interface PouchProject {
  id: string,
  name: string,
  dbName: string
}

export interface PouchFeldExcelBericht {
  name: string
  type: string

}

export interface PouchPositionFeldExcelBericht {
  row: number
  column: number
  field: PouchFeldExcelBericht
  id: string
  multirowAbstandZeile?: number
  multicolAbstandSpalte?: number

}

export interface PouchVorlageExcelbericht {
  vorlage?: File

  name: string
  id: string
  filename: string

  fields: PouchPositionFeldExcelBericht[]
}

export interface PouchFileReference {
  name: string,
  referenz: string
}

export interface PouchLuftschadstoffmessung {
  id: string
  file: PouchFileReference,
  grenzwert: number,
  bemerkung: string,

  abgastemperatur: number
  ableitbedingungenErfüllt: boolean
  abluftkonzentration: number
  austrittsfläche: number
  austrittsgeschwindigkeitAbluft: number

  datum: number
  gemessenerAbluftvolumenstrom: number
  genehmigterAbluftvolumenstrom: number
  geruchsrelevanz: boolean
  massenstrom: number
}

export interface PouchLuftschadstoffgenehmigung {
  id: string
  aktenzeichen: string,
  file: PouchFileReference
  gueltigBis: number | null
  gueltigAb: number | null
  name: string | null
  genehmigungsdatum: number | null
}
