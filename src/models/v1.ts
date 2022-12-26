
import * as Factory from 'factory.ts';
export interface Pegelreihe {
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

export interface Projekt {
  name: string,
  id: string
}

export interface Vorlage {
  name: string,
  id: string
}

export interface Messgeraet {
  name: string,
  id: string
}

export interface Auswertungspegelreihe {
  summiert: number
}

export interface Anlagenpegelreihe {
  korrektur: number
}

export interface AuswertungDefault {
  mittelungspegel: Pegelreihe[]
  anlagenpegel: (Pegelreihe | Anlagenpegelreihe)[]

  lwlin: Pegelreihe | Auswertungspegelreihe
  lwa: Pegelreihe | Auswertungspegelreihe
}

export interface MesspunktAnAnlage {
  fremdpegel: Pegelreihe
  gesamtpegel: Pegelreihe

  metainfoFremdpegel: Metainfo
  metainfoGesamtpegel: Metainfo
  id: string

  fremdpegelVorhanden: boolean

}




export interface MesswertreiheDiscriminator {
  type: string
  metainfo: Metainfo
  vorhanden: boolean
}

export interface MesswertereiheDTO {
  hz31_5: number;
  hz63: number;
  additional: string
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
  messgeraet: Messgeraet | null
  id: string
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

}

export interface KarteDetails {
  url: string
  georeferenzierung?: Georeferenzierung

}

export interface AuswertungDTO {
  id: string
  korrektur_anlage1: number
  anlagenpegel_1: MesswertereiheDTO

  lwa: MesswertereiheDTO
  lwlin: MesswertereiheDTO
}

export interface Messposition {
  fremdpegel: Pegelreihe
  gesamtpegel: Pegelreihe
  fremdpegel_vorhanden: boolean
  id: string
}


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

  messpositionen: Map<number, MesspositionEditViewModel>

  auswertung?: AuswertungDefault

  type: string

}

export interface Plant {
  id: string,
  name: string,
  children: Building[],
  header: string
  body: string
}

export interface Building {
  id: string,
  name: string,
  children: Roof[],
  header: string
  body: string
}

export interface Roof {
  id: string,
  name: string,
  children: Emittent[]
  header: string
  body: string
}

export interface Emittent {
  id: string,
  name: string
  header: string
  body: string
}

export interface EmittentDetails {
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

const messwertereiheFactory = Factory.Sync.makeFactory<Pegelreihe>({
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
});

const messpositionFactory = Factory.Sync.makeFactory<Messposition>({
  id: Factory.each((i) => `${i}`),
  fremdpegel: messwertereiheFactory.build(),
  gesamtpegel: messwertereiheFactory.build(),
  fremdpegel_vorhanden: true,
});

const _messungFactory = Factory.Async.makeFactoryWithRequired<Messung, 'type'>({
  id: Factory.Async.each((i) => `${i}`),
  datum: 'Abc',
  messpositionen: Factory.Async.each(() => new Map<number, MesspositionEditViewModel>()),
  geometrie_messung: Factory.Async.each(() => geometrieMessungFactory.build()),
  geometrie_emittent: Factory.Async.each(() => geometrieEmittentFactory.build())
});



const messungFactory = _messungFactory.transform(obj => {
  switch (obj.type) {


    case '1P':
      obj.messpositionen.set(1, messpositionEditViewModelFactory.build())
      return obj
    case '2P':
      obj.messpositionen.set(1, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(2, messpositionEditViewModelFactory.build())
      return obj
    case '3P':
      obj.messpositionen.set(1, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(2, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(3, messpositionEditViewModelFactory.build())
      return obj
    case '4P':
      obj.messpositionen.set(1, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(2, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(3, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(4, messpositionEditViewModelFactory.build())
      return obj
    case '5P':
      obj.messpositionen.set(1, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(2, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(3, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(4, messpositionEditViewModelFactory.build())
      obj.messpositionen.set(5, messpositionEditViewModelFactory.build())
      return obj
  }
})

const georeferenzpunktFactory = Factory.Sync.makeFactory<Georeferenzierungspunkt>({
  gk_hoch: 1,
  gk_rechts: 2,
  pixel_x: 3,
  pixel_y: 4,
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
})





const plantFactory = Factory.Sync.makeFactory<Plant>({
  id: Factory.each((i) => `P${i}`),
  name: Factory.each((i) => `${i}`),
  children: Factory.each(() => [buildingFactory.build(), buildingFactory.build()]),
  header: 'werk',
  body: 'werk'
})

const buildingFactory = Factory.Sync.makeFactory<Building>({
  id: Factory.each((i) => `B${i}`),
  name: Factory.each((i) => `${i}`),
  children: Factory.each(() => [roofFactory.build(), roofFactory.build()]),
  header: 'gebaeude',
  body: 'gebaeude'
})

const roofFactory = Factory.Sync.makeFactory<Roof>({
  id: Factory.each((i) => `R${i}`),
  name: Factory.each((i) => `${i}`),
  children: Factory.each(() => [emittentFactory.build(), emittentFactory.build()]),
  header: 'dach',
  body: 'dach'
})

const emittentFactory = Factory.Sync.makeFactory<Emittent>({
  id: Factory.each((i) => `E${i}`),
  name: Factory.each((i) => `${i}`),
  header: 'emittent',
  body: 'emittent'
})


const metainfoFactory = Factory.Sync.makeFactory<Metainfo>({
  name_messfile: Factory.each((i) => `M${i}`),
  messgeraet: Factory.each((i) => null),
  messdatum: '2022-01-01',
  id: Factory.each((i) => `E${i}`)

})

const messwertereiheDiscriminatorFactory = Factory.Sync.makeFactory({
  id: Factory.each((i) => `M${i}`),
  metainfo: metainfoFactory.build(),
  vorhanden: true,
  type: 'Gesamtpegel'
}).combine(messwertereiheFactory)

const anlagenpegelFactory: Factory.Sync.Factory<Anlagenpegelreihe & Pegelreihe> = Factory.Sync.makeFactory({
  korrektur: 3
}).combine(messwertereiheFactory)

const auswertungspegelFactory: Factory.Sync.Factory<Auswertungspegelreihe & Pegelreihe> = Factory.Sync.makeFactory({
  summiert: 43
}).combine(messwertereiheFactory)

const messpunktAnAnlageFactory = Factory.Sync.makeFactory<MesspunktAnAnlage>({
  id: Factory.each((i) => `M${i}`),
  metainfoFremdpegel: metainfoFactory.build(),
  metainfoGesamtpegel: metainfoFactory.build(),
  fremdpegelVorhanden: true,
  fremdpegel: Factory.each((i) => messwertereiheFactory.build()),
  gesamtpegel: Factory.each((i) => messwertereiheFactory.build()),

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
  messungen: Factory.Sync.each(() => [])
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
  mittelungspegel: Factory.each(() => messwertereiheFactory.buildList(2))
})

const projectFactory = Factory.Sync.makeFactory<Projekt>({
  name: 'blub',
  id: Factory.each((i) => `M${i}`)
})

const messgeraetFactory = Factory.Sync.makeFactory<Messgeraet>({
  name: 'blub',
  id: Factory.each((i) => `M${i}`)
})

const vorlageFactory = Factory.Sync.makeFactory<Vorlage>({
  name: 'blub',
  id: Factory.each((i) => `M${i}`)
})
export {
  projectFactory,
  vorlageFactory,
  messgeraetFactory,
  auswertungFactory,
  auswertungspegelFactory,
  anlagenpegelFactory,
  metainfoFactory,
  messpositionEditViewModelFactory,
  messwertereiheDiscriminatorFactory,
  messwertereiheFactory,
  messpositionFactory,
  messungFactory,
  georeferenzpunktFactory,
  georeferenzierungFactory,
  plantFactory,
  buildingFactory,
  roofFactory,
  emittentFactory,
  messpunktAnAnlageFactory
}


