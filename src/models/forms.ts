import { boolean } from 'mathjs'

export interface LuftschadstoffeForm {
  id: string
  bemerkung: string,
  datum: string,
  abluftkonzentration: number,
  grenzwert: number,
  massenstrom: number,
  file: FileList,
  geruchsrelevanz: boolean,
  gemessenerAbluftvolumenstrom: number, //"m³"),
  genehmigterAbluftvolumenstrom: number, // "m³"),
  austrittsgeschwindigkeitAbluft: number,// "m/s"),
  ableitbedingungenErfüllt: boolean, //true),
  abgastemperatur: number, // "°C"),
  austrittsfläche: number //  "m²"),
}

export interface SchallmessungForm {
  id: string

  datum: string,

  // geometrie_emittent: PouchGeometrieEmittent,
  // geometrie_messung: PouchGeometrieMessung

  messpositionen: MesswertereiheForm[]
  // auswertung: PouchAuswertung | null

  type: string

  messverfahren: string
}



export interface MesswertereiheForm {
  fremdpegelVorhanden: boolean
  gesamtpegel__hz31_5: number
  gesamtpegel__hz63: number
  gesamtpegel__hz125: number
  gesamtpegel__hz250: number
  gesamtpegel__hz500: number
  gesamtpegel__hz1000: number
  gesamtpegel__hz2000: number
  gesamtpegel__hz4000: number
  gesamtpegel__hz8000: number
  gesamtpegel__messfile: string
  gesamtpegel__messgeraet: string
  gesamtpegel__overview: string

  fremdpegel__hz31_5: number
  fremdpegel__hz63: number
  fremdpegel__hz125: number
  fremdpegel__hz250: number
  fremdpegel__hz500: number
  fremdpegel__hz1000: number
  fremdpegel__hz2000: number
  fremdpegel__hz4000: number
  fremdpegel__hz8000: number
  fremdpegel__messfile: string
  fremdpegel__messgeraet: string
  fremdpegel__overview: string

  id: string
}

export interface EmittentDetailsForm {
  id: string
  name: string
  gkRechts: number
  gkHoch: number
  hoehe: number
  bemerkung: string
  messungen: SchallmessungForm[]
  picture: string
  filename: string

  bearbeiter: string,
  kostenstelle: string,
  abteilung: string,
  messinstitut: string,
  anlage: string,
  created: string,
  modified: string,
  inBetrieb: boolean,
  fuerMessungVormerken: boolean,
  anFassade: boolean,

  // luftschadstoffe: Luftschadstoffe

}

export interface ProjectForm {
  name: string,
  dbName: string,
  id: string
}

export interface OverviewForm {
  filename: string
  id: string
  lastModfied: string
}

export interface MessgeraetForm {
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

export interface GenehmigungForm {
  id: string
  aktenzeichen: string,
  file: FileList
  gueltigBis: string
  gueltigAb: string
  name: string
  genehmigungsdatum?: string
}



export interface GeoreferenzierungspunktForm {
  pixelX: number
  pixelY: number
  gkRechts: number
  gkHoch: number
  id: string
}

export interface KoordinatenForm {
  gkRechts: number
  gkHoch: number

}

export interface KarteForm {
  georeferenzierung?: GeoreferenzierungForm
  id: string

  filename: string | null

  roof: string | null,
  plant: string | null,
}

export interface GeoreferenzierungForm {
  id: string | null
  referenzierungspunkt_set: GeoreferenzierungspunktForm[]
  x00: number
  x01: number
  x02: number
  x10: number
  x11: number
  x12: number

  upperLeft: KoordinatenForm
  upperRight: KoordinatenForm
  lowerRight: KoordinatenForm
  lowerLeft: KoordinatenForm
}

export interface FormFeldExcelBericht {
  name: string
  type: string

}

export interface FormPositionFeldExcelBericht {
  row: number
  column: number
  field: FormFeldExcelBericht
  id: string
  multirowAbstandZeile?: number
  multicolAbstandSpalte?: number

}

export interface FormVorlageExcelbericht {
  vorlage?: File

  name: string
  id: string

  filename: string

  fields: FormPositionFeldExcelBericht[]
}
