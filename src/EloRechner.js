import punkteprozent from './punkteprozent.json'

const EloRechner = (elo, kFactor, matches) => {

// const Elo_input = [[], []]

// matches.forEach(match => {
//     Elo_input[0].push(parseFloat(match.opponentElo))  // Gegner Elo
//     Elo_input[1].push(parseFloat(match.result))  // Resultat (0, 0.5, 1)
//   })

const Elo_input = [
    [
      2053,
      2150,
      2174,
      2178,
      2143,
      2398,
      2157,
      2119,
      2267
    ],
    [
      1,
      0,
      0.5,
      0.5,
      1,
      0,
      0.5,
      0.5,
      1
    ]
  ]
  
const Punkteprozent = punkteprozent.data

// Globale Variablen
let Elo_neu = parseFloat(elo) // Anfangswert alte Elo
let erzieltePunkte = 0
let Gegner = 0
const Partien = Elo_input[0].length //matches.length

// Berechnung der neuen Elo
for (let i = 0; i < Partien; i++) {
    // Sonderfall: Elo_Gegner < Elo_ich - 400
    if (Elo_input[0][i] < parseFloat(elo) - 400) {
        Elo_input[0][i] = parseFloat(elo) - 400
    }

    const Ea = 1 / (1 + Math.pow(10, (Elo_input[0][i] - parseFloat(elo)) / 400)) // Erwartungswert
    Elo_neu += kFactor * (Elo_input[1][i] - Ea) // Neue Elo Berechnung
    erzieltePunkte += Elo_input[1][i]

    // Sonderfall: Performance, wenn Elo_Gegner < 2050
    if (Elo_input[0][i] < 2050) {
        Elo_input[0][i] = 2050
    }

    Gegner += Elo_input[0][i]
}

const Gegnerschnitt = Gegner / Partien
const Elodifferenz = Math.round((Elo_neu - parseFloat(elo)) * 100) / 100

// Output 1: Neue Elo und erzielte Punkte
console.log('erzielte Punkte:', erzieltePunkte)
console.log('neue Elo:', parseFloat(Elo_neu.toFixed(2)))
console.log('Elo-Differenz:', Elodifferenz)

// Performance ausrechnen
const Punkteprozentwert = Math.round((erzieltePunkte / Partien * 100)) / 100

let Wertedifferenz = 0
for (let k = 0; k < 101; k++) {
    if (Punkteprozent[0][k] === Punkteprozentwert) {
        Wertedifferenz = Punkteprozent[1][k]
        break
    }
}

const perform = Gegnerschnitt + Wertedifferenz

// Output 2: Gegnerschnitt, Wertedifferenz und Performance
console.log('Gegnerschnitt:', parseFloat(Gegnerschnitt.toFixed(2)))
console.log('Wertedifferenz:', Wertedifferenz)
console.log('Elo-Performance:', parseFloat(perform.toFixed(2)))

// Norm erreicht?
if (perform >= 2449.5 && Partien >= 7 && Gegnerschnitt >= 2230 && (erzieltePunkte / Partien) >= 0.35) {
    console.log('IM-Norm erreicht, Glückwunsch!!')
}

}

export default EloRechner