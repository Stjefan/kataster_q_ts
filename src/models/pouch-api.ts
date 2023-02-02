
export interface PouchPlant {
  id: string,
  name: string,
  descriminator: string
  map: PouchMap
}


export interface PouchBuilding {
  id: string,
  name: string,
  plant: string,
  descriminator: string
}

export interface PouchRoof {
  id: string,
  name: string,
  building: string
  map: PouchMap
  descriminator: string

}

export interface PouchEmittent {
  id: string,
  name: string,
  descriminator: string
  roof: string
  lage: PouchKoordinaten,

  bemerkung: string
  messungen: PouchMessung[]
  picture: Blob

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
}

export interface PouchMessung {
  id: string,
  datum: string,

  geometrie_emittent: PouchGeometrieEmittent,
  geometrie_messung: PouchGeometrieMessung

  messpositionen: Messposition[]

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

export interface MesspunktAnAnlage {
  fremdpegel: PouchPegelreihe
  gesamtpegel: PouchPegelreihe

  metainfoFremdpegel: Metainfo
  metainfoGesamtpegel: Metainfo
  id: string

  fremdpegelVorhanden: boolean

}


export interface Messposition {
  messwertereihen: (MesspunktAnAnlage)[]
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

export interface Georeferenzierungspunkt {
  gk_rechts: number
  gk_hoch: number
  pixel_x: number
  pixel_y: number
  id: string
}

export interface Metainfo {
  name_messfile: string
  messdatum: string
  name_overviewfile: string
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

  upper_left: PouchKoordinaten
  upper_right: PouchKoordinaten
  lower_right: PouchKoordinaten
  lower_left: PouchKoordinaten

}

export interface PouchMap {
  url: string
  georeferenzierung?: Georeferenzierung
  id: string

  zuordnung: string | null,
  discriminator: string | null,
  image: Blob | null

}

export interface PouchKoordinaten {
  gkrechts: number
  gkhoch: number
}

export interface PouchKoordinatenHoehe {
  gkrechts: number
  gkhoch: number
  hoehe: number
}

export interface PouchMessgeraet {
  name: string
}
