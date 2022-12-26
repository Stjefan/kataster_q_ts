import { createMap, createMapper, forMember, mapFrom, mapWith } from '@automapper/core';
import { afterMap } from '@automapper/core/lib/mapping-configurations/after-map';

import { PojosMetadataMap, pojos } from '@automapper/pojos';
import {
  Pegelreihe, MesswertereiheDTO, Messposition, MesspositionDTO, MesswertreiheDiscriminator,
  MesspositionEditViewModel,
  messpositionFactory, messwertereiheFactory, Messung, geometrieEmittentFactory, geometrieMessungFactory
} from 'src/models/v1';

import { Pegelreihe as PegelreiheAPI, EinPunktMessung, Messposition as MesspositionAPI, EinPunktAuswertung, MesspositionPegelreiheSerializerV2 } from '../models/api'



export function createUserMetadata() {


  PojosMetadataMap.create<Pegelreihe>('Pegelreihe', {
    hz31_5: Number,
    hz1000: Number
  });

  PojosMetadataMap.create<PegelreiheAPI>('PegelreiheAPI', {
    hz315: Number,
    hz1000: Number
  })

  PojosMetadataMap.create<Messposition>('Messposition', {
    fremdpegel: 'Pegelreihe',
    gesamtpegel: 'Pegelreihe',
    fremdpegel_vorhanden: Boolean
  })

  PojosMetadataMap.create<Messung>('Messung', {
    id: String,
    type: String,
    messpositionen: 'MesspositionEditViewModel'
  })

  PojosMetadataMap.create<MesspositionEditViewModel>('MesspositionEditViewModel', {
    // messwertereihen: ''
    id: String,
    messwertereihen: 'MesswertreiheDiscriminator'
  })

  PojosMetadataMap.create<MesswertreiheDiscriminator>('MesswertreiheDiscriminator', {
    type: String,
  })

  PojosMetadataMap.create<MesspositionAPI>('MesspositionAPI', {
    id: String,
    messpositionpegelreiheSet: 'MesspositionPegelreiheSerializerV2'

  })

  PojosMetadataMap.create<EinPunktMessung>('EinPunktMessung', {
    messposition1: 'MesspositionAPI'
  })

  PojosMetadataMap.create<MesspositionPegelreiheSerializerV2>('MesspositionPegelreiheSerializerV2', {
    fremdpegel: 'PegelreiheAPI',
    // metainfoFremdpegel: String,
    gesamtpegel: 'PegelreiheAPI',
  })


}

createUserMetadata();

export const mapper = createMapper({ strategyInitializer: pojos() });


createMap<(MesswertreiheDiscriminator & Pegelreihe), MesspositionPegelreiheSerializerV2>(
  mapper,
  'MesswertreiheDiscriminator',
  'MesspositionPegelreiheSerializerV2',
  forMember(
    (destination) => destination.id,
    mapFrom(() => 27)),
  forMember(
    (destination) => destination.gesamtpegel,
    mapWith('PegelreiheAPI', 'Pegelreihe', (source) => source.type == 'Gesamtpegel' ? source : null)
  ),
  forMember(
    (destination) => destination.fremdpegel,
    mapWith('PegelreiheAPI', 'Pegelreihe', (source) => source.type == 'Fremdpegel' ? source : null)
  )
)

createMap<Pegelreihe, MesswertereiheDTO>(
  mapper,
  'Messwertereihe',
  'MesswertereiheDTO2',
  forMember(
    (destination) => destination.additional,
    mapFrom(() => 'YYY')),
  forMember(
    (destination) => destination.hz63,
    mapFrom((source) => source.hz63))
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
    (destination) => destination.hz315,
    mapFrom((src) => src.hz31_5)),
)

createMap<PegelreiheAPI, Pegelreihe>(
  mapper,
  'PegelreiheAPI',
  'Pegelreihe',
  forMember(
    (destination) => destination.hz31_5,
    mapFrom((src) => src.hz315)),
)





createMap<Messposition, MesspositionDTO>(
  mapper,
  'Messposition',
  'MesspositionDTO'
)

const srcMessposition = messpositionFactory.build()

console.log(srcMessposition)
const srcMesswertereihe = messwertereiheFactory.build()

const dto_messposition = mapper.map<Messposition, MesspositionDTO>(
  srcMessposition,
  'Messposition', // this needs to match what we passed in PojosMetadataMap.create()
  'MesspositionDTO' // this needs to match what we passed in PojosMetadataMap.create()
);


console.log(srcMessposition, dto_messposition)
const dto_messwertereiheDTO = mapper.map<Pegelreihe, MesswertereiheDTO>(
  srcMesswertereihe,
  'Messwertereihe', // this needs to match what we passed in PojosMetadataMap.create()
  'MesswertereiheDTO2' // this needs to match what we passed in PojosMetadataMap.create()
);
console.log(srcMesswertereihe, dto_messwertereiheDTO)

