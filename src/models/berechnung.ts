import { anlagenpegelFactory, Anlagenpegelreihe, auswertungspegelFactory, Auswertungspegelreihe, GeometrieEmittent, GeometrieMessung, getField, Korrekturwert, MesspositionEditViewModel, MesspunktAnAnlage, messwertereiheFactory, pegelfrequenzenFields, Pegelreihe, setField } from './v1'



function berechneWinkelfehler() {
  console.log('berechneKorrektur')

}

function energetische_summe(arg: Pegelreihe[]) {
  const mittelungspegel_gesamt = messwertereiheFactory.build()
  for (const f of pegelfrequenzenFields) {

    const arr = arg.map(i => getField(i, f))
    // console.log(arr)
    const energie_f = arr.reduce((acc, current) => acc + Math.pow(10, 0.1 * current), 0)
    // console.log('energy', energie_f)
    setField(mittelungspegel_gesamt, f, 10 * Math.log10(energie_f / arr.length))
  }
  return mittelungspegel_gesamt

}

function energieInPegelreihe(arg: Pegelreihe) {
  const energie_f = pegelfrequenzenFields.reduce((acc, current) => acc + Math.pow(10, 0.1 * getField(arg, current)), 0)
  return energie_f
}

export function berechneMittelungspegel(arg: MesspositionEditViewModel) {
  const gesamtpegelreihen = arg.messwertereihen.map(i => i.gesamtpegel)
  console.log('gesamtpegelreihen', gesamtpegelreihen)

  const mittelungspegel_gesamt = energetische_summe(gesamtpegelreihen)

  const fremdpegelreihen = arg.messwertereihen.filter(i => i.fremdpegelVorhanden).map(i => i.fremdpegel)

  if (fremdpegelreihen.length > 0) {
    const mittelungspegel_fremd = energetische_summe(fremdpegelreihen)
    console.log('berechneMittelungspegel', mittelungspegel_gesamt, mittelungspegel_fremd)
    return {
      gesamtpegel: mittelungspegel_gesamt,
      fremdpegel: mittelungspegel_fremd
    }
  } else {
    console.log('berechneMittelungspegel', mittelungspegel_gesamt)
    return {
      gesamtpegel: mittelungspegel_gesamt,
      fremdpegel: null
    }
  }

  console.log('mittelungspegel_gesamt', mittelungspegel_gesamt)





}

export function transformZ2A(arg: Auswertungspegelreihe & Pegelreihe) {
  const result = auswertungspegelFactory.build()
  result.hz31_5 = arg.hz31_5 - 39.4;
  result.hz63 = arg.hz63 - 26.2;
  result.hz125 = arg.hz125 - 16.1;
  result.hz250 = arg.hz250 - 8.6;
  result.hz500 = arg.hz500 - 3.2;
  result.hz1000 = arg.hz1000;
  result.hz2000 = arg.hz2000 + 1.2;
  result.hz4000 = arg.hz4000 + 1;
  result.hz8000 = arg.hz8000 - 1.1;

  result.summiert = 10 * Math.log10(energieInPegelreihe(result));

  return result;
}

export function berechneLwlin(args: [Anlagenpegelreihe & Pegelreihe]) {
  const korregierte_anlagenpegel = []
  for (const arg of args) {
    const anlagenpegel = messwertereiheFactory.build()
    for (const f of pegelfrequenzenFields) {

      setField(anlagenpegel, f, getField(arg, f) + arg.korrektur)
    }
    korregierte_anlagenpegel.push(anlagenpegel)
  }
  const auswertungspegelreihe = auswertungspegelFactory.build()

  let summierteEnergie = 0
  for (const f of pegelfrequenzenFields) {

    setField(auswertungspegelreihe, f, korregierte_anlagenpegel.reduce((i, j) => i + getField(j, f), 0))
    summierteEnergie += getField(auswertungspegelreihe, f)
  }
  auswertungspegelreihe.summiert = summierteEnergie / pegelfrequenzenFields.length
  console.log('berechnelwlin', auswertungspegelreihe)
  return auswertungspegelreihe

}



export function berechneAnlagenpegel(args: MesspositionEditViewModel, korrektur: number) {
  const messpunkte_an_anlage = []

  for (const arg of args.messwertereihen) {
    const anlagenpegel = anlagenpegelFactory.build()

    for (const f of pegelfrequenzenFields) {
      if (arg.fremdpegelVorhanden) {
        setField(anlagenpegel, f, 10 * Math.log10(10 ** (0.1 * getField(arg.gesamtpegel, f)) - 10 ** (0.1 * getField(arg.fremdpegel, f))))
      } else {
        setField(anlagenpegel, f, getField(arg.gesamtpegel, f))
      }
    }
    messpunkte_an_anlage.push(anlagenpegel)
    console.log('anlagenpegel an messpunkten', anlagenpegel)
  }


  const gemittelter_anlagenpegel = energetische_summe(messpunkte_an_anlage) // anlagenpegelFactory.build()

  const a_quer = { ...gemittelter_anlagenpegel, korrektur: korrektur } as Anlagenpegelreihe & Pegelreihe

  console.log('gemittelter anlagenpegel', a_quer)

  return a_quer
}

function berechneMessflaechenschalldruckpegel() {
  console.log('berechneKorrektur')

}




export {
  berechneMessflaechenkorrektur
}

function berechneMessflaechenkorrektur(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung,
  messverfahren: string
) {
  switch (messverfahren) {
    case 'Quadermessung an 1 reflektierenden Ebene':
      return berechneKorrekturQuader1(emittent_geometrie, messung_geometrie);
    case 'Quadermessung an 2 reflektierenden Ebenen':
      return berechneKorrekturQuader2(emittent_geometrie, messung_geometrie);
    case 'Quadermessung an 3 reflektierenden Ebenen':
      return berechneKorrekturQuader3(emittent_geometrie, messung_geometrie);
    case 'Quadermessung an 3 reflektierenden Ebenen':
      return berechneKorrekturQuader3(emittent_geometrie, messung_geometrie);
    case 'Kaminmessung (eckig)':
      return berechneKorrekturKaminEckig(emittent_geometrie, messung_geometrie);
    case 'Kugelmessung (default)':
      return berechneKorrekturKugel(emittent_geometrie, messung_geometrie);
    case 'Innerhalb einer rahmen Fläche':
      return berechneKorrekturInnerhalbRahmen(
        emittent_geometrie,
        messung_geometrie
      );
    case 'Außerhalb einer eckigen Fläche':
      return berechneKorrekturAusserhalbEckig(
        emittent_geometrie,
        messung_geometrie
      );
    case 'Außerhalb einer Kreisfläche':
      return berechneKorrekturAusserhalbKreis(
        emittent_geometrie,
        messung_geometrie
      );

    case 'Außerhalb eines Rahmens':
      return berechneKorrekturAusserhalbRahmen(
        emittent_geometrie,
        messung_geometrie
      );
    case 'Innerhalb einer Kreisfläche':
      return berechneKorrekturInnerhalbKreis(emittent_geometrie, messung_geometrie)
    case 'Innerhalb einer eckigen Fläche':
      return berechneKorrekturInnerhalbEckig(emittent_geometrie, messung_geometrie)
    case 'Kühlturmmessung':
      return berechneKorrekturKuehlturm(emittent_geometrie, messung_geometrie)
    case 'Kühler an Fläche':
      return berechneKorrekturKuehlerFlaeche(emittent_geometrie, messung_geometrie)
    case 'Kühler an Kante':
      return berechneKorrekturKuehlerKante(emittent_geometrie, messung_geometrie)
    case 'Innenpegel':
      throw new Error(`${messverfahren} not implemented`);
    default:
      throw new Error(`Unknown messverfahren: ${messverfahren}`);
      return berechneKorrekturQuader2(emittent_geometrie, messung_geometrie);
  }
  console.log(emittent_geometrie, messung_geometrie);
}

// 9.9
// "emittent_geometrie": { "id": 161, "geo1": 0.6, "geo2": 0.8, "geo3": 0.5, "geo4": 0 }, "messung_geometrie": { "id": 161, "geoxy": 0.5, "geoh": 0, "komega": 0, "k_2_a": 0 }
export function berechneKorrekturQuader1(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const a = emittent_geometrie.geo1 / 2 + messung_geometrie.geoxy;
  const b = emittent_geometrie.geo2 / 2 + messung_geometrie.geoxy;
  const c = emittent_geometrie.geo3 + messung_geometrie.geoxy;
  const lw_before_logarithm = 4 * (a * b + b * c + c * a);
  // Winkelfehler-Berechnung nach 'F. Probst: Bestimmung des Schallleistungspegels von Industrieschallquellen [...]', Projekt 10716
  const oberflächeReferenzquader = lw_before_logarithm;
  const messabstand = messung_geometrie.geoxy;
  const winkelfehler =
    1.2805 * Math.log10(Math.pow(oberflächeReferenzquader / messabstand, 2)) -
    0.0107;
  console.log(10 * Math.log10(lw_before_logarithm), winkelfehler)
  return { lw1: 10 * Math.log10(lw_before_logarithm), winkelfehler };
}

//  "korrekturwert_1": 10.8, .4, "emittent_geometrie": { "id": 160, "geo1": 0.7, "geo2": 1.7, "geo3": 1.2, "geo4": 0 }, "messung_geometrie": { "id": 160, "geoxy": 0.5, "geoh": 0, "komega": 0, "k_2_a": 0 }
export function berechneKorrekturQuader2(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const a = emittent_geometrie.geo1 / 2 + messung_geometrie.geoxy / 2;
  const b = emittent_geometrie.geo2 / 2 + messung_geometrie.geoxy;
  const c = emittent_geometrie.geo3 + messung_geometrie.geoxy;
  const lw_before_logarithm = 2 * (2 * a * c + 2 * a * b + b * c);
  // Winkelfehler-Berechnung nach 'F. Probst: Bestimmung des Schallleistungspegels von Industrieschallquellen [...]', Projekt 10716
  const oberflächeReferenzquader = lw_before_logarithm;
  console.log('oberflächeReferenzquader', oberflächeReferenzquader)
  const messabstand = messung_geometrie.geoxy;
  const winkelfehler =
    1.2805 * Math.log10(Math.pow(oberflächeReferenzquader / messabstand, 2)) -
    0.0107;
  console.log(10 * Math.log10(lw_before_logarithm), winkelfehler)
  return { lw1: 10 * Math.log10(lw_before_logarithm), winkelfehler };
}

function berechneKorrekturQuader3(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const a = emittent_geometrie.geo1 / 2 + messung_geometrie.geoxy / 2;
  const b = emittent_geometrie.geo2 / 2 + messung_geometrie.geoxy / 2;
  const c = emittent_geometrie.geo3 + messung_geometrie.geoxy;
  const lw_before_logarithm = 2 * (a * c + 2 * a * b + b * c);
  // Winkelfehler-Berechnung nach 'F. Probst: Bestimmung des Schallleistungspegels von Industrieschallquellen [...]', Projekt 10716
  const oberflächeReferenzquader = lw_before_logarithm;
  const messabstand = messung_geometrie.geoxy;
  const winkelfehler =
    1.2805 * Math.log10(Math.pow(oberflächeReferenzquader / messabstand, 2)) -
    0.0107;
  console.log(10 * Math.log10(lw_before_logarithm), winkelfehler)
  return { lw1: 10 * Math.log10(lw_before_logarithm), winkelfehler };
}

function berechneKorrekturKaminRund(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const r1 =
    2 *
    Math.PI *
    Math.pow(emittent_geometrie.geo1 / 2 + messung_geometrie.geoxy, 2);
  let r2 = 0;
  if (emittent_geometrie.geo2 > 0.8) {
    r2 = 0;
  } else {
    const rk = emittent_geometrie.geo1 / 2 + emittent_geometrie.geo2;
    const rs = emittent_geometrie.geo1 / 2 + messung_geometrie.geoxy;
    r2 =
      2 * Math.PI * rs * Math.sqrt(Math.abs(Math.pow(rs, 2) - Math.pow(rk, 2)));
  }
  return { lw1: 10 * Math.log10(r1), lw2: 10 * Math.log10(r2) };
}

// FALSCHER WERT
//   "korrekturwert_1": 5.5, "korrekturwert_2": 3.8 "emittent_geometrie": { "id": 88, "geo1": 0.98, "geo2": 0.98, "geo3": 0, "geo4": 0 }, "messung_geometrie": { "id": 88, "geoxy": 0.2, "geoh": 0, "komega": 0, "k_2_a": 0 }
function berechneKorrekturKaminEckig(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const r1 =
    2 *
    Math.PI *
    Math.pow(
      messung_geometrie.geoxy +
      2 *
      Math.sqrt(
        (emittent_geometrie.geo1 * emittent_geometrie.geo2) /
        (4 * Math.PI)
      ),
      2
    );
  let r2 = 0;
  if (emittent_geometrie.geo2 > 0.8) {
    r2 = 0;
  } else {
    const rk =
      Math.sqrt(
        ((emittent_geometrie.geo1 / 2 + emittent_geometrie.geo3) *
          emittent_geometrie.geo2) /
        2 +
        emittent_geometrie.geo3
      ) / Math.PI;
    const rs = messung_geometrie.geoxy;
    r2 =
      2 * Math.PI * rs * Math.sqrt(Math.abs(Math.pow(rs, 2) - Math.pow(rk, 2)));
  }
  return { lw1: 10 * Math.log10(r1), lw2: 10 * Math.log10(r2) };
}

function berechneKorrekturKugel(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const result = {} as Korrekturwert;
  if (
    messung_geometrie.geoxy < 1 ||
    messung_geometrie.geoxy <
    2 *
    Math.sqrt(
      Math.pow(emittent_geometrie.geo1 / 2, 2) +
      Math.pow(emittent_geometrie.geo2 / 2, 2) +
      Math.pow(emittent_geometrie.geo3 / 2, 2)
    )
  ) {
    result.bemerkung = 'Nicht Richtlinienkonform';
  }

  const r1 = 4 * (Math.PI * Math.pow(messung_geometrie.geoxy, 2));
  result.lw1 = 10 * Math.log10(r1);
  return result;
}

function berechneKorrekturKugel1(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const result = {} as Korrekturwert;
  if (
    messung_geometrie.geoxy < 1 ||
    messung_geometrie.geoxy <
    2 *
    Math.sqrt(
      Math.pow(emittent_geometrie.geo1 / 2, 2) +
      Math.pow(emittent_geometrie.geo2 / 2, 2) +
      Math.pow(emittent_geometrie.geo3, 2)
    )
  ) {
    result.bemerkung = 'Nicht Richtlinienkonform';
  }

  const r1 = 2 * (Math.PI * Math.pow(messung_geometrie.geoxy, 2));
  result.lw1 = 10 * Math.log10(r1);
  return result;
}

function berechneKorrekturKugel2(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const result = {} as Korrekturwert;
  if (
    messung_geometrie.geoxy < 1 ||
    messung_geometrie.geoxy <
    2 *
    Math.sqrt(
      Math.pow(emittent_geometrie.geo1 / 2, 2) +
      Math.pow(emittent_geometrie.geo2, 2) +
      Math.pow(emittent_geometrie.geo3, 2)
    )
  ) {
    result['bemerkung'] = 'Nicht Richtlinienkonform';
  }

  const r1 = Math.PI * Math.pow(messung_geometrie.geoxy, 2);
  result['lw1'] = 10 * Math.log10(r1);
  return result;
}

function berechneKorrekturKugel3(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const result = {} as Korrekturwert;
  if (
    messung_geometrie.geoxy < 1 ||
    messung_geometrie.geoxy <
    2 *
    Math.sqrt(
      Math.pow(emittent_geometrie.geo1, 2) +
      Math.pow(emittent_geometrie.geo2, 2) +
      Math.pow(emittent_geometrie.geo3, 2)
    )
  ) {
    result.bemerkung = 'Nicht Richtlinienkonform';
  }

  const r1 = 0.5 * (Math.PI * Math.pow(messung_geometrie.geoxy, 2));
  result.lw1 = 10 * Math.log10(r1);
  return result;
}

function berechneKorrekturKuehlturm(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const r1 = emittent_geometrie.geo1 * emittent_geometrie.geo2;
  const r2 =
    2 *
    Math.PI *
    Math.pow(messung_geometrie.geoxy + emittent_geometrie.geo3, 2);
  const r3 =
    2 *
    Math.PI *
    emittent_geometrie.geo4 *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);

  return {
    lw1: 10 * Math.log10(r1),
    lw2: 10 * Math.log10(r2),
    lw3: Math.log10(r3),
  };
}

function berechneKorrekturKuehlerFlaeche(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const r1 =
    (emittent_geometrie.geo1 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo2 + 2 * messung_geometrie.geoxy);
  const r2 =
    (emittent_geometrie.geo2 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);
  const r3 =
    (emittent_geometrie.geo1 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);
  const r4 =
    (emittent_geometrie.geo2 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);
  const r5 =
    (emittent_geometrie.geo1 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);

  return {
    lw1: 10 * Math.log10(r1),
    lw2: 10 * Math.log10(r2),
    lw3: Math.log10(r3),
    lw4: Math.log10(r4),
    lw5: Math.log10(r5),
  };
}

function berechneKorrekturKuehlerKante(emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung) {
  const r1 =
    (emittent_geometrie.geo1 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo2 + 2 * messung_geometrie.geoxy);
  const r2 =
    (emittent_geometrie.geo2 + messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);
  const r3 =
    (emittent_geometrie.geo1 + 2 * messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);
  const r4 =
    (emittent_geometrie.geo2 + messung_geometrie.geoxy) *
    (emittent_geometrie.geo3 + messung_geometrie.geoxy);

  return {
    lw1: 10 * Math.log10(r1),
    lw2: 10 * Math.log10(r2),
    lw3: Math.log10(r3),
    lw4: Math.log10(r4),
  };
}

function berechneKorrekturInnerhalbRahmen(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const r1 =
    emittent_geometrie.geo1 * emittent_geometrie.geo2 -
    emittent_geometrie.geo3 * emittent_geometrie.geo4;
  return { lw1: 10 * Math.log10(r1) };
}

function berechneKorrekturInnerhalbEckig(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const r1 = emittent_geometrie.geo1 * emittent_geometrie.geo2;
  return { lw1: 10 * Math.log10(r1) };
}

function berechneKorrekturInnerhalbKreis(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const r1 = Math.PI * Math.pow(emittent_geometrie.geo1 / 2, 2);
  return { lw1: 10 * Math.log10(r1) };
}

function berechneKorrekturInnerhalbKreisring(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const r1 =
    Math.PI * Math.pow(emittent_geometrie.geo1 / 2, 2) -
    Math.PI * Math.pow(emittent_geometrie.geo2 / 2, 2);
  return { lw1: 10 * Math.log10(r1) };
}

function berechneKorrekturAusserhalbRahmen(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const aussen = __berechneKorrekturBeiAussenflaeche(
    messung_geometrie.geoxy,
    messung_geometrie.geoh,
    emittent_geometrie.geo3,
    emittent_geometrie.geo4,
    messung_geometrie.komega
  );
  const innen = __berechneKorrekturBeiAussenflaeche(
    messung_geometrie.geoxy,
    messung_geometrie.geoh,
    emittent_geometrie.geo1,
    emittent_geometrie.geo2,
    messung_geometrie.komega
  );
  return { lw1: 10 * Math.log10(aussen - innen) };
}

function berechneKorrekturAusserhalbEckig(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const korrektur = __berechneKorrekturBeiAussenflaeche(
    messung_geometrie.geoxy,
    messung_geometrie.geoh,
    emittent_geometrie.geo1,
    emittent_geometrie.geo2,
    messung_geometrie.komega
  );
  return { lw1: 10 * Math.log10(korrektur) };
}

function berechneKorrekturAusserhalbKreis(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const equivalentSquare = emittent_geometrie.geo1 * Math.sqrt(Math.PI);
  console.log(equivalentSquare, messung_geometrie.geoh);
  const korrektur = __berechneKorrekturBeiAussenflaeche(
    messung_geometrie.geoxy,
    messung_geometrie.geoh,
    equivalentSquare,
    equivalentSquare,
    messung_geometrie.komega
  );
  return { lw1: 10 * Math.log10(korrektur) };
}

function berechneKorrekturAusserhalbKreisring(
  emittent_geometrie: GeometrieEmittent,
  messung_geometrie: GeometrieMessung
) {
  const equivalentSquare_aussen = emittent_geometrie.geo2 * Math.sqrt(Math.PI);
  const equivalentSquare_innen = emittent_geometrie.geo1 * Math.sqrt(Math.PI);
  const korrektur_aussen = __berechneKorrekturBeiAussenflaeche(
    messung_geometrie.geoxy,
    messung_geometrie.geoh,
    equivalentSquare_aussen,
    equivalentSquare_aussen,
    messung_geometrie.komega
  );
  const korrektur_innen = __berechneKorrekturBeiAussenflaeche(
    messung_geometrie.geoxy,
    messung_geometrie.geoh,
    equivalentSquare_innen,
    equivalentSquare_innen,
    messung_geometrie.komega
  );

  return { lw1: 10 * Math.log10(korrektur_aussen - korrektur_innen) };
}

function __berechneKorrekturBeiAussenflaeche(xy: number, h: number, l: number, b: number, abstrahlmass: number) {
  const flaeche_x = b;
  const flaeche_y = l;
  console.log(xy, h, l, b, abstrahlmass);

  const micro_x = xy;
  const micro_y = flaeche_y / 2;
  const micro_z = h;

  const dx = flaeche_x / 100;
  const dy = flaeche_y / 100;

  let summe = 0;
  for (let i = 1; i <= 100; i++) {
    const x = dx / 2 + (i - 1) * dx;
    for (let ii = 1; ii <= 100; ii++) {
      const y = dy / 2 + (ii - 1) * dy;
      const r_2 =
        Math.pow(micro_x - x, 2) +
        Math.pow(micro_y - y, 2) +
        Math.pow(micro_z, 2);
      // console.log(r_2);
      const pegel =
        10 * Math.log10(dx * dy) - 10 * Math.log10(4 * Math.PI * r_2);
      summe += Math.pow(10, 0.1 * pegel);
    }
  }
  const lw_hyp = 10 * Math.log10(summe);

  return (
    ((flaeche_x * flaeche_y) / Math.pow(10, abstrahlmass * 0.1)) *
    Math.pow(10, 0.1 * lw_hyp)
  );
}
