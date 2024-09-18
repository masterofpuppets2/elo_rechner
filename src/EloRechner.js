import punkteprozent from './punkteprozent.json'
import { Dialog, DialogTitle, DialogContent, Typography, Link, IconButton } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CloseIcon from '@mui/icons-material/Close'
import { FEMALE } from './constants'

const EloRechner = ({ open, handleClose, elo, kFactor, matches, gender }) => {
  // const Elo_input = [[], []]

  // matches.forEach(match => {
  //     Elo_input[0].push(parseFloat(match.opponentElo))  // Gegner Elo
  //     Elo_input[1].push(parseFloat(match.result))  // Resultat (0, 0.5, 1)
  //   })

  // const Elo_input = [
  //     [
  //       2053,
  //       2150,
  //       2174,
  //       2178,
  //       2143,
  //       2398,
  //       2157,
  //       2119,
  //       2267
  //     ],
  //     [
  //       1,
  //       0,
  //       0.5,
  //       0.5,
  //       1,
  //       0,
  //       0.5,
  //       0.5,
  //       1
  //     ]
  //   ]

  //Bedingung für GM Norm
  const Elo_input = [
    [2500, 2550, 2480, 2420, 2600, 2450, 2390, 2380, 2400],
    [1, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 1],
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

  // Performance ausrechnen
  const Punkteprozentwert = Math.round((erzieltePunkte / Partien) * 100) / 100

  let Wertedifferenz = 0
  for (let k = 0; k < 101; k++) {
    if (Punkteprozent[0][k] === Punkteprozentwert) {
      Wertedifferenz = Punkteprozent[1][k]
      break
    }
  }

  const perform = Gegnerschnitt + Wertedifferenz

  // // Output: Neue Elo und erzielte Punkte, Gegnerschnitt, Wertedifferenz und Performance
  // console.log('erzielte Punkte:', erzieltePunkte)
  // console.log('neue Elo:', parseFloat(Elo_neu.toFixed(2)))
  // console.log('Elo-Differenz:', Elodifferenz)
  // console.log('Gegnerschnitt:', parseFloat(Gegnerschnitt.toFixed(2)))
  // console.log('Elo-Performance:', parseFloat(perform.toFixed(2)))

  const imNormErreicht =
    perform >= 2450 && Partien >= 7 && Gegnerschnitt >= 2230 && erzieltePunkte / Partien >= 0.35

  const gmNormErreicht =
    perform >= 2600 && Partien >= 7 && Gegnerschnitt >= 2380 && erzieltePunkte / Partien >= 0.35

  const wimNormErreicht =
    gender === FEMALE &&
    perform >= 2400 &&
    Partien >= 7 &&
    Gegnerschnitt >= 2180 &&
    erzieltePunkte / Partien >= 0.35

  const wgmNormErreicht =
    gender === FEMALE &&
    perform >= 2250 &&
    Partien >= 7 &&
    Gegnerschnitt >= 2030 &&
    erzieltePunkte / Partien >= 0.35

  const normData = [
    { condition: imNormErreicht, color: 'green', norm: 'IM' },
    { condition: gmNormErreicht, color: 'blue', norm: 'GM' },
    { condition: wimNormErreicht, color: 'orange', norm: 'WIM' },
    { condition: wgmNormErreicht, color: 'purple', norm: 'WGM' },
  ]

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Elo Rechner Ergebnisse
        <IconButton
          edge="end"
          onClick={handleClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: '8px',
            right: '20px',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          <strong>Erzielte Punkte:</strong> {erzieltePunkte}
        </Typography>
        <Typography>
          <strong>Neue Elo:</strong> {parseFloat(Elo_neu.toFixed(2))}
        </Typography>
        <Typography>
          <strong>Elo-Differenz:</strong> {Elodifferenz}
        </Typography>
        <Typography>
          <strong>Gegnerschnitt:</strong> {parseFloat(Gegnerschnitt.toFixed(2))}
        </Typography>
        <Typography>
          <strong>Elo-Performance:</strong> {parseFloat(perform.toFixed(2))}
        </Typography>

        {normData.map(
          ({ condition, color, norm }, index) =>
            condition && (
              <Typography key={index} color={color}>
                <strong>{norm}-Norm erreicht, Glückwunsch!</strong>{' '}
                <EmojiEventsIcon sx={{ verticalAlign: 'middle' }} /> <br />
              </Typography>
            )
        )}

        {(imNormErreicht || gmNormErreicht || wgmNormErreicht || wimNormErreicht) && (
          <Typography>
            Der Gegnerschnitt wurde hier ebenfalls berücksichtigt. Zur Überprüfung der weiteren
            Kriterien siehe{' '}
            <Link
              href="https://handbook.fide.com/chapter/B012022"
              target="_blank"
              rel="noopener"
              sx={{
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  color: 'black',
                  textDecoration: 'none',
                },
              }}
            >
              Titelbestimmung
            </Link>
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EloRechner
