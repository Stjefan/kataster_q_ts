
/**
 *
 * @export
 * @interface Building
 */
export interface Building {
  /**
   *
   * @type {string}
   * @memberof Building
   */
  name: string;
  /**
   *
   * @type {Array<number>}
   * @memberof Building
   */
  roofSet?: Array<number>;
  /**
   *
   * @type {number}
   * @memberof Building
   */
  plant: number;
  /**
   *
   * @type {number}
   * @memberof Building
   */
  id?: number;
}

/**
*
* @export
* @interface Document
*/
export interface Document {
  /**
   *
   * @type {string}
   * @memberof Document
   */
  file?: string;
}

/**
*
* @export
* @interface DreiPunktAuswertung
*/
export interface DreiPunktAuswertung {
  /**
   *
   * @type {Pegelreihe}
   * @memberof DreiPunktAuswertung
   */
  anlagenpegel1: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof DreiPunktAuswertung
   */
  anlagenpegel2: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof DreiPunktAuswertung
   */
  anlagenpegel3: Pegelreihe;
  /**
   *
   * @type {number}
   * @memberof DreiPunktAuswertung
   */
  korrekturwert1?: number;
  /**
   *
   * @type {number}
   * @memberof DreiPunktAuswertung
   */
  korrekturwert2?: number;
  /**
   *
   * @type {number}
   * @memberof DreiPunktAuswertung
   */
  korrekturwert3?: number;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof DreiPunktAuswertung
   */
  lwlin: PegelreiheAuswertung;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof DreiPunktAuswertung
   */
  lwa: PegelreiheAuswertung;
}

/**
*
* @export
* @interface DreiPunktMessung
*/
export interface DreiPunktMessung {
  /**
   *
   * @type {number}
   * @memberof DreiPunktMessung
   */
  id?: number;
  /**
   *
   * @type {Date}
   * @memberof DreiPunktMessung
   */
  messdatum?: Date;
  /**
   *
   * @type {string}
   * @memberof DreiPunktMessung
   */
  name?: string;
  /**
   *
   * @type {Messposition}
   * @memberof DreiPunktMessung
   */
  messposition_1: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof DreiPunktMessung
   */
  messposition_2: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof DreiPunktMessung
   */
  messposition_3: Messposition;
  /**
   *
   * @type {number}
   * @memberof DreiPunktMessung
   */
  emittent: number;
  /**
   *
   * @type {DreiPunktAuswertung}
   * @memberof DreiPunktMessung
   */
  auswertung: DreiPunktAuswertung;
  /**
   *
   * @type {string}
   * @memberof DreiPunktMessung
   */
  typ: DreipunktMessungTyp;
  /**
   *
   * @type {GeometrieEmittent}
   * @memberof DreiPunktMessung
   */
  emittent_geometrie: GeometrieEmittent;
  /**
   *
   * @type {GeometrieMessung}
   * @memberof DreiPunktMessung
   */
  messung_geometrie: GeometrieMessung;
}



/**
*
* @export
* @interface EinPunktAuswertung
*/
export interface EinPunktAuswertung {
  /**
   *
   * @type {Pegelreihe}
   * @memberof EinPunktAuswertung
   */
  anlagenpegel_1: Pegelreihe;
  /**
   *
   * @type {number}
   * @memberof EinPunktAuswertung
   */
  korrekturwert_1?: number;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof EinPunktAuswertung
   */
  lwlin: PegelreiheAuswertung;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof EinPunktAuswertung
   */
  lwa: PegelreiheAuswertung;
  id: number
}

/**
*
* @export
* @interface EinPunktMessung
*/
export interface EinPunktMessung {
  /**
   *
   * @type {number}
   * @memberof EinPunktMessung
   */
  id?: number;
  /**
   *
   * @type {Date}
   * @memberof EinPunktMessung
   */
  messdatum?: Date;
  /**
   *
   * @type {string}
   * @memberof EinPunktMessung
   */
  name?: string;
  /**
   *
   * @type {Messposition}
   * @memberof EinPunktMessung
   */
  messposition_1: Messposition;
  /**
   *
   * @type {number}
   * @memberof EinPunktMessung
   */
  emittent: number;
  /**
   *
   * @type {EinPunktAuswertung}
   * @memberof EinPunktMessung
   */
  auswertung: EinPunktAuswertung;
  /**
   *
   * @type {string}
   * @memberof EinPunktMessung
   */
  typ: EinpunktMessungTyp;
  /**
   *
   * @type {GeometrieEmittent}
   * @memberof EinPunktMessung
   */
  emittent_geometrie: GeometrieEmittent;
  /**
   *
   * @type {GeometrieMessung}
   * @memberof EinPunktMessung
   */
  messung_geometrie: GeometrieMessung;
}

/**
* @export
* @namespace EinPunktMessung
*/

export enum EinpunktMessungTyp {
  QuadermessungAn1ReflektierendenEbene = 'Quadermessung an 1 reflektierenden Ebene',
  QuadermessungAn2ReflektierendenEbenen = 'Quadermessung an 2 reflektierenden Ebenen',
  QuadermessungAn3ReflektierendenEbenen = 'Quadermessung an 3 reflektierenden Ebenen',
  KugelmessungDefault = 'Kugelmessung (Default)',
  InnerhalbEinerEckigenFlche = 'Innerhalb einer eckigen Fläche',
  InnerhalbEinerRahmenFlche = 'Innerhalb einer rahmen Fläche',
  InnerhalbEinerKreisflche = 'Innerhalb einer Kreisfläche',
  InnerhalbEinerKreisringflche = 'Innerhalb einer Kreisringfläche',
  AuerhalbEinerEckigenFlche = 'Außerhalb einer eckigen Fläche',
  AuerhalbEinerRahmenFlche = 'Außerhalb einer rahmen Fläche',
  AuerhalbEinerKreisflche = 'Außerhalb einer Kreisfläche',
  AuerhalbEinerKreisringflche = 'Außerhalb einer Kreisringfläche',
  Innenpegel = 'Innenpegel'
}




export enum VierpunktMessungTyp {
  KhlerAnKante = 'Kühler an Kante'
}
export enum FuenfpunktMessungTyp {
  KhlerAnFlche = 'Kühler an Fläche'
}
export enum DreipunktMessungTyp {
  Khlturmmessung = 'Kühlturmmessung'
}

export enum KaminMessungTyp {
  Eckig = 'Kaminmessung (eckig)',
  Rund = 'Kaminmessung (rund)'
}
/**
*
* @export
* @interface Emittent
*/
export interface Emittent {
  /**
   *
   * @type {string}
   * @memberof Emittent
   */
  name: string;
  /**
   *
   * @type {number}
   * @memberof Emittent
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof Emittent
   */
  header?: string;
  /**
   *
   * @type {string}
   * @memberof Emittent
   */
  body?: string;
  /**
   *
   * @type {number}
   * @memberof Emittent
   */
  roof: number;
  /**
   *
   * @type {KoordinatenHoehe}
   * @memberof Emittent
   */
  lage?: KoordinatenHoehe;
  /**
   *
   * @type {string}
   * @memberof Emittent
   */
  uniqueKey?: string;
}

/**
*
* @export
* @interface EmittentDetail
*/
export interface EmittentDetail {
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  name: string;
  /**
   *
   * @type {number}
   * @memberof EmittentDetail
   */
  id?: number;
  /**
   *
   * @type {Array<EinPunktMessung>}
   * @memberof EmittentDetail
   */
  ein_punkt_messungen: Array<EinPunktMessung>;
  /**
   *
   * @type {Array<KaminMessung>}
   * @memberof EmittentDetail
   */
  kamin_messungen: Array<KaminMessung>;
  /**
   *
   * @type {Array<DreiPunktMessung>}
   * @memberof EmittentDetail
   */
  drei_punkt_messungen: Array<DreiPunktMessung>;
  /**
   *
   * @type {Array<VierPunktMessung>}
   * @memberof EmittentDetail
   */
  vier_punkt_messungen: Array<VierPunktMessung>;
  /**
   *
   * @type {Array<FuenfPunktMessung>}
   * @memberof EmittentDetail
   */
  fuenf_punkt_messungen: Array<FuenfPunktMessung>;
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  abteilung?: string;
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  kostenstelle?: string;
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  bearbeiter?: string;
  /**
   *
   * @type {KoordinatenHoehe}
   * @memberof EmittentDetail
   */
  lage: KoordinatenHoehe;
  /**
   *
   * @type {boolean}
   * @memberof EmittentDetail
   */
  liegt_an_fassade?: boolean;
  in_betrieb?: boolean;
  fuer_messung_vormerken?: boolean;
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  anlage?: string;
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  messinstitut?: string;
  /**
   *
   * @type {Array<Document>}
   * @memberof EmittentDetail
   */
  document_set: Array<Document>;
  /**
   *
   * @type {string}
   * @memberof EmittentDetail
   */
  image?: string;
  bemerkung?: string,
}

/**
*
* @export
* @interface FuenfPunktAuswertung
*/
export interface FuenfPunktAuswertung {
  /**
   *
   * @type {Pegelreihe}
   * @memberof FuenfPunktAuswertung
   */
  anlagenpegel1: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof FuenfPunktAuswertung
   */
  anlagenpegel2: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof FuenfPunktAuswertung
   */
  anlagenpegel3: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof FuenfPunktAuswertung
   */
  anlagenpegel4: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof FuenfPunktAuswertung
   */
  anlagenpegel5: Pegelreihe;
  /**
   *
   * @type {number}
   * @memberof FuenfPunktAuswertung
   */
  korrekturwert1?: number;
  /**
   *
   * @type {number}
   * @memberof FuenfPunktAuswertung
   */
  korrekturwert2?: number;
  /**
   *
   * @type {number}
   * @memberof FuenfPunktAuswertung
   */
  korrekturwert3?: number;
  /**
   *
   * @type {number}
   * @memberof FuenfPunktAuswertung
   */
  korrekturwert4?: number;
  /**
   *
   * @type {number}
   * @memberof FuenfPunktAuswertung
   */
  korrekturwert5?: number;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof FuenfPunktAuswertung
   */
  lwlin: PegelreiheAuswertung;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof FuenfPunktAuswertung
   */
  lwa: PegelreiheAuswertung;
}

/**
*
* @export
* @interface FuenfPunktMessung
*/
export interface FuenfPunktMessung {
  /**
   *
   * @type {number}
   * @memberof FuenfPunktMessung
   */
  id?: number;
  /**
   *
   * @type {Date}
   * @memberof FuenfPunktMessung
   */
  messdatum?: Date;
  /**
   *
   * @type {string}
   * @memberof FuenfPunktMessung
   */
  name?: string;
  /**
   *
   * @type {Messposition}
   * @memberof FuenfPunktMessung
   */
  messposition_1: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof FuenfPunktMessung
   */
  messposition_2: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof FuenfPunktMessung
   */
  messposition_3: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof FuenfPunktMessung
   */
  messposition_4: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof FuenfPunktMessung
   */
  messposition_5: Messposition;
  /**
   *
   * @type {number}
   * @memberof FuenfPunktMessung
   */
  emittent: number;
  /**
   *
   * @type {FuenfPunktAuswertung}
   * @memberof FuenfPunktMessung
   */
  auswertung: FuenfPunktAuswertung;
  /**
   *
   * @type {string}
   * @memberof FuenfPunktMessung
   */
  typ: FuenfpunktMessungTyp;
  /**
   *
   * @type {GeometrieEmittent}
   * @memberof FuenfPunktMessung
   */
  emittent_geometrie: GeometrieEmittent;
  /**
   *
   * @type {GeometrieMessung}
   * @memberof FuenfPunktMessung
   */
  messung_geometrie: GeometrieMessung;
}


/**
*
* @export
* @interface GeometrieEmittent
*/
export interface GeometrieEmittent {
  /**
   *
   * @type {number}
   * @memberof GeometrieEmittent
   */
  id?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieEmittent
   */
  geo_1?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieEmittent
   */
  geo_2?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieEmittent
   */
  geo_3?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieEmittent
   */
  geo_4?: number;
}

/**
*
* @export
* @interface GeometrieMessung
*/
export interface GeometrieMessung {
  /**
   *
   * @type {number}
   * @memberof GeometrieMessung
   */
  id?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieMessung
   */
  geo_xy?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieMessung
   */
  geo_k_omega?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieMessung
   */
  geo_k_2_a?: number;
  /**
   *
   * @type {number}
   * @memberof GeometrieMessung
   */
  geo_h?: number;
}

/**
*
* @export
* @interface Georeferenzierung
*/
export interface Georeferenzierung {
  /**
   *
   * @type {number}
   * @memberof Georeferenzierung
   */
  x00?: number;
  /**
   *
   * @type {number}
   * @memberof Georeferenzierung
   */
  x01?: number;
  /**
   *
   * @type {number}
   * @memberof Georeferenzierung
   */
  x02?: number;
  /**
   *
   * @type {number}
   * @memberof Georeferenzierung
   */
  x10?: number;
  /**
   *
   * @type {number}
   * @memberof Georeferenzierung
   */
  x11?: number;
  /**
   *
   * @type {number}
   * @memberof Georeferenzierung
   */
  x12?: number;
  /**
   *
   * @type {Array<Referenzierungspunkt>}
   * @memberof Georeferenzierung
   */
  referenzierungspunkt_set: Array<Referenzierungspunkt>;
  /**
   *
   * @type {Koordinaten}
   * @memberof Georeferenzierung
   */
  upper_left: Koordinaten;
  /**
   *
   * @type {Koordinaten}
   * @memberof Georeferenzierung
   */
  upper_right: Koordinaten;
  /**
   *
   * @type {Koordinaten}
   * @memberof Georeferenzierung
   */
  lower_right: Koordinaten;
  /**
   *
   * @type {Koordinaten}
   * @memberof Georeferenzierung
   */
  lower_left: Koordinaten;
  id: number
}


/**
 *
 * @export
 * @interface Koordinaten
 */
export interface Koordinaten {
  /**
   *
   * @type {number}
   * @memberof Koordinaten
   */
  gk_rechts: number;
  /**
   *
   * @type {number}
   * @memberof Koordinaten
   */
  gk_hoch: number;
  /**
   *
   * @type {number}
   * @memberof Koordinaten
   */
  id?: number;
}

/**
*
* @export
* @interface KoordinatenHoehe
*/
export interface KoordinatenHoehe {
  /**
   *
   * @type {number}
   * @memberof KoordinatenHoehe
   */
  gk_rechts: number;
  /**
   *
   * @type {number}
   * @memberof KoordinatenHoehe
   */
  gk_hoch: number;
  /**
   *
   * @type {number}
   * @memberof KoordinatenHoehe
   */
  hoehe: number;
  /**
   *
   * @type {number}
   * @memberof KoordinatenHoehe
   */
  id?: number;
}



/**
 *
 * @export
 * @interface Pegelreihe
 */
export interface Pegelreihe {
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  id?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz31_5?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz63?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz125?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz250?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz500?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz1000?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz2000?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz4000?: number;
  /**
   *
   * @type {number}
   * @memberof Pegelreihe
   */
  hz8000?: number;
}

/**
 *
 * @export
 * @interface PegelreiheAuswertung
 */
export interface PegelreiheAuswertung {
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  id?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz31_5?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz63?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz125?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz250?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz500?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz1000?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz2000?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz4000?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  hz8000?: number;
  /**
   *
   * @type {number}
   * @memberof PegelreiheAuswertung
   */
  summiert?: number;
}

export interface Messposition {
  /**
   *
   * @type {Array<MesspositionPegelreiheSerializerV2>}
   * @memberof Messposition
   */
  messpositionpegelreihe_set: Array<MesspositionPegelreiheSerializerV2>;
  /**
   *
   * @type {number}
   * @memberof Messposition
   */
  id?: number;
}


/**
 *
 * @export
 * @interface MesspositionPegelreiheSerializerV2
 */
export interface MesspositionPegelreiheSerializerV2 {
  /**
   *
   * @type {Pegelreihe}
   * @memberof MesspositionPegelreiheSerializerV2
   */
  fremdpegel?: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof MesspositionPegelreiheSerializerV2
   */
  gesamtpegel: Pegelreihe;
  /**
   *
   * @type {Metainfo}
   * @memberof MesspositionPegelreiheSerializerV2
   */
  metainfo_fremdpegel?: Metainfo;
  /**
   *
   * @type {Metainfo}
   * @memberof MesspositionPegelreiheSerializerV2
   */
  metainfo_gesamtpegel: Metainfo;
  /**
   *
   * @type {number}
   * @memberof MesspositionPegelreiheSerializerV2
   */
  id?: number;
}


/**
 *
 * @export
 * @interface Metainfo
 */
export interface Metainfo {
  /**
   *
   * @type {number}
   * @memberof Metainfo
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof Metainfo
   */
  datum: string;
  /**
   *
   * @type {string}
   * @memberof Metainfo
   */
  file_no: string;
  /**
   *
   * @type {string}
   * @memberof Metainfo
   */
  overview_path: string;

  messgeraet: string | null
}

/**
 *
 * @export
 * @interface VierPunktMessung
 */
export interface VierPunktMessung {
  /**
   *
   * @type {number}
   * @memberof VierPunktMessung
   */
  id?: number;
  /**
   *
   * @type {Date}
   * @memberof VierPunktMessung
   */
  messdatum?: Date;
  /**
   *
   * @type {string}
   * @memberof VierPunktMessung
   */
  name?: string;
  /**
   *
   * @type {Messposition}
   * @memberof VierPunktMessung
   */
  messposition_1: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof VierPunktMessung
   */
  messposition_2: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof VierPunktMessung
   */
  messposition_3: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof VierPunktMessung
   */
  messposition_4: Messposition;
  /**
   *
   * @type {number}
   * @memberof VierPunktMessung
   */
  emittent: number;
  /**
   *
   * @type {VierPunktAuswertung}
   * @memberof VierPunktMessung
   */
  auswertung: VierPunktAuswertung;
  /**
   *
   * @type {string}
   * @memberof VierPunktMessung
   */
  typ: VierpunktMessungTyp;
  /**
   *
   * @type {GeometrieEmittent}
   * @memberof VierPunktMessung
   */
  emittent_geometrie: GeometrieEmittent;
  /**
   *
   * @type {GeometrieMessung}
   * @memberof VierPunktMessung
   */
  messung_geometrie: GeometrieMessung;
}

/**
 *
 * @export
 * @interface VierPunktAuswertung
 */
export interface VierPunktAuswertung {
  /**
   *
   * @type {Pegelreihe}
   * @memberof VierPunktAuswertung
   */
  anlagenpegel1: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof VierPunktAuswertung
   */
  anlagenpegel2: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof VierPunktAuswertung
   */
  anlagenpegel3: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof VierPunktAuswertung
   */
  anlagenpegel4: Pegelreihe;
  /**
   *
   * @type {number}
   * @memberof VierPunktAuswertung
   */
  korrekturwert1?: number;
  /**
   *
   * @type {number}
   * @memberof VierPunktAuswertung
   */
  korrekturwert2?: number;
  /**
   *
   * @type {number}
   * @memberof VierPunktAuswertung
   */
  korrekturwert3?: number;
  /**
   *
   * @type {number}
   * @memberof VierPunktAuswertung
   */
  korrekturwert4?: number;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof VierPunktAuswertung
   */
  lwlin: PegelreiheAuswertung;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof VierPunktAuswertung
   */
  lwa: PegelreiheAuswertung;
}

/**
 *
 * @export
 * @interface KaminMessung
 */
export interface KaminMessung {
  /**
   *
   * @type {number}
   * @memberof KaminMessung
   */
  id?: number;
  /**
   *
   * @type {Date}
   * @memberof KaminMessung
   */
  messdatum?: Date;
  /**
   *
   * @type {string}
   * @memberof KaminMessung
   */
  name?: string;
  /**
   *
   * @type {Messposition}
   * @memberof KaminMessung
   */
  messpositionA1: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof KaminMessung
   */
  messpositionA2: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof KaminMessung
   */
  messpositionB1: Messposition;
  /**
   *
   * @type {Messposition}
   * @memberof KaminMessung
   */
  messpositionB2: Messposition;
  /**
   *
   * @type {number}
   * @memberof KaminMessung
   */
  emittent: number;
  /**
   *
   * @type {KaminAuswertung}
   * @memberof KaminMessung
   */
  auswertung: KaminAuswertung;
  /**
   *
   * @type {string}
   * @memberof KaminMessung
   */
  typ: KaminMessungTyp;
  /**
   *
   * @type {GeometrieEmittent}
   * @memberof KaminMessung
   */
  emittent_geometrie: GeometrieEmittent;
  /**
   *
   * @type {GeometrieMessung}
   * @memberof KaminMessung
   */
  messung_geometrie: GeometrieMessung;
}


/**
 *
 * @export
 * @interface KaminAuswertung
 */
export interface KaminAuswertung {
  /**
   *
   * @type {Pegelreihe}
   * @memberof KaminAuswertung
   */
  anlagenpegel1: Pegelreihe;
  /**
   *
   * @type {Pegelreihe}
   * @memberof KaminAuswertung
   */
  anlagenpegel2: Pegelreihe;
  /**
   *
   * @type {number}
   * @memberof KaminAuswertung
   */
  korrekturwert1?: number;
  /**
   *
   * @type {number}
   * @memberof KaminAuswertung
   */
  korrekturwert2?: number;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof KaminAuswertung
   */
  lwlin: PegelreiheAuswertung;
  /**
   *
   * @type {PegelreiheAuswertung}
   * @memberof KaminAuswertung
   */
  lwa: PegelreiheAuswertung;
}

/**
 *
 * @export
 * @interface Referenzierungspunkt
 */
export interface Referenzierungspunkt {
  /**
   *
   * @type {number}
   * @memberof Referenzierungspunkt
   */
  pixel_x?: number;
  /**
   *
   * @type {number}
   * @memberof Referenzierungspunkt
   */
  pixel_y?: number;
  /**
   *
   * @type {Koordinaten}
   * @memberof Referenzierungspunkt
   */
  koordinaten: Koordinaten;
  /**
   *
   * @type {number}
   * @memberof Referenzierungspunkt
   */
  id?: number;
}



// Custom

export interface Project {
  id: number,
  name: string,
  beschreibung: null
}


export interface Werk {
  id: number,
  name: string,
  map: null,
  project: number | null
}


export interface Roof {
  id: string,
  name: string,
  map: KarteApi,
  building: number,
}


export interface KarteApi {
  id: string
  plant_set: number[],
  roof_set: number[],
  upload: string | null,
  georeferenzierung: Georeferenzierung | null
}

export interface TreeNodeApi {
  id: string,
  name: string,
  body: string,
  header: string,
  children: TreeNodeApi[]
  map: KarteApi | null,
  lage: KoordinatenHoehe | null
}

export interface MessgeraetApi {
  id: number
  name: string

  hz31_5: number
  hz63: number
  hz125: number
  hz250: number
  hz500: number
  hz1000: number
  hz2000: number
  hz4000: number
  hz8000: number

  format_datetime_filename: string
  format_datetime_overview: string
}
