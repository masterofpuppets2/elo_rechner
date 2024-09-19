import './EloRechner.css'
import punkteprozent from './punkteprozent.json'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Link,
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CloseIcon from '@mui/icons-material/Close'
import { FEMALE } from './constants'

const EloRechner = ({ open, handleClose, elo, kFactor, matches, gender }) => {
  const Elo_input = [[], []]

  matches.forEach((match) => {
    Elo_input[0].push(parseFloat(match.opponentElo))
    Elo_input[1].push(parseFloat(match.result))
  })

  //Bedingung für GM Norm
  // const Elo_input = [
  //   [2500, 2550, 2480, 2420, 2600, 2450, 2390, 2380, 2400],
  //   [1, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 1],
  // ]

  const Punkteprozent = punkteprozent.data

  // Globale Variablen
  let Elo_neu = parseFloat(elo) // Anfangswert alte Elo
  let erzieltePunkte = 0
  let Gegner = 0
  const Partien = matches.length //Elo_input[0].length matches.length

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
    {
      condition: imNormErreicht,
      color: 'white', //success
      norm: 'IM',
      backgroundColor: 'purple', //#FFCDD2
    },
    { condition: gmNormErreicht, color: 'info', norm: 'GM', backgroundColor: '#FFA500' },
    { condition: wimNormErreicht, color: 'orange', norm: 'WIM', backgroundColor: '#0000FF' },
    { condition: wgmNormErreicht, color: 'error', norm: 'WGM', backgroundColor: '#00B8D4' },
  ]

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Elo Rechner Auswertung
        <IconButton edge="end" onClick={handleClose} aria-label="close" className="header">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title="Neue Elo" />
              <CardContent>
                <Typography variant="h4">{parseFloat(Elo_neu.toFixed(2))}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title="Performance" />
              <CardContent>
                <Typography variant="h4">{parseFloat(perform.toFixed(2))}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title="Gegnerschnitt" />
              <CardContent>
                <Typography variant="h4">{parseFloat(Gegnerschnitt.toFixed(2))}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title="Erzielte Punkte" />
              <CardContent>
                <Typography variant="h4">{erzieltePunkte}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {normData.map(
            ({ condition, color, norm, backgroundColor }, index) =>
              condition && (
                <Grid item xs={12} key={index}>
                  <Card sx={{ backgroundColor: { backgroundColor } }}>
                    <CardContent>
                      <Typography variant="h5" color={color}>
                        <strong>{norm}-Norm erreicht, Glückwunsch!</strong>{' '}
                        <EmojiEventsIcon className="icon-middle-align" />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
          )}

          {(imNormErreicht || gmNormErreicht || wgmNormErreicht || wimNormErreicht) && (
            <Grid item xs={12}>
              Der Gegnerschnitt wurde hier ebenfalls berücksichtigt. Zur Überprüfung der weiteren
              Kriterien siehe{' '}
              <Link
                href="https://handbook.fide.com/chapter/B012022"
                target="_blank"
                rel="noopener"
                className="text-norm"
              >
                Titelbestimmung
              </Link>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default EloRechner
