import { anlagenpegelFactory, Anlagenpegelreihe, auswertungspegelFactory, getField, MesspositionEditViewModel, MesspunktAnAnlage, messwertereiheFactory, pegelfrequenzenFields, Pegelreihe, setField } from './v1'

function berechneMessflaechenkorrektur() {
  console.log('berechneKorrektur')
}

function berechneWinkelfehler() {
  console.log('berechneKorrektur')

}

function berechneMittelungspegel(arg: MesspositionEditViewModel) {
  const gesamtpegelreihen = arg.messwertereihen.map(i => i.gesamtpegel)

  const fremdpegelreihen = arg.messwertereihen.filter(i => i.fremdpegelVorhanden).map(i => i.fremdpegel)

  console.log('berechneMittelungspegel', gesamtpegelreihen, fremdpegelreihen)
}

function berechneLwlin(args: [Anlagenpegelreihe & Pegelreihe]) {
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
  console.log('berechneAnlagenpegel', auswertungspegelreihe)
  return auswertungspegelreihe

}

function berechneABewertung(args: Pegelreihe) {
  const auswertungspegelreihe = auswertungspegelFactory.build()
  for (const f of pegelfrequenzenFields) {

    setField(auswertungspegelreihe, f, getField(args, f) + 10)
  }
  return auswertungspegelreihe

}

function berechneAnlagenpegel(args: MesspositionEditViewModel) {
  const messpunkte_an_anlage = []
  for (const arg of args.messwertereihen) {
    const anlagenpegel = anlagenpegelFactory.build()
    for (const f of pegelfrequenzenFields) {
      if (arg.fremdpegelVorhanden) {
        setField(anlagenpegel, f, getField(arg.gesamtpegel, f) + getField(arg.fremdpegel, f))
      } else {
        setField(anlagenpegel, f, getField(arg.gesamtpegel, f))
      }
    }
    messpunkte_an_anlage.push(anlagenpegel)
  }
  const gemittelter_anlagenpegel = anlagenpegelFactory.build()

  for (const f of pegelfrequenzenFields) {

    setField(gemittelter_anlagenpegel, f, messpunkte_an_anlage.reduce((i, j) => i + getField(j, f), 0))
  }
  console.log('berechneAnlagenpegel', gemittelter_anlagenpegel)

  return gemittelter_anlagenpegel
}

function berechneMessflaechenschalldruckpegel() {
  console.log('berechneKorrektur')

}




export {
  berechneMessflaechenkorrektur
}
