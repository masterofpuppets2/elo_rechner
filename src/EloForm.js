import React, { useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import './EloForm.css'
import EloRechner from './EloRechner'
import InfoIcon from '@mui/icons-material/Info'
import { FEMALE } from './constants'

const EloForm = () => {
  const [elo, setElo] = useState('')
  const [gender, setGender] = useState('')
  const [kFactor, setKFactor] = useState('')
  const [matches, setMatches] = useState([{ opponentElo: '', result: '' }])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const handleAddMatch = () => {
    setMatches([...matches, { opponentElo: '', result: '' }])
  }

  const handleRemoveMatch = (index) => {
    const newMatches = matches.filter((_, i) => i !== index)
    setMatches(newMatches)
  }

  const handleMatchChange = (index, event) => {
    const { name, value } = event.target
    const newMatches = [...matches]
    newMatches[index][name] = value
    setMatches(newMatches)
  }

  const validateInputs = () => {
    if (!elo || !kFactor) {
      return 'Bitte geben Sie alle erforderlichen Informationen ein.'
    }

    for (const match of matches) {
      if (!match.opponentElo || match.result === '') {
        //!match.result würde nicht funktionieren, da es bei Ergebnis 0 auch einen Fehler werfen würde
        return 'Bitte stellen Sie sicher, dass sowohl die ELO des Gegners als auch das Ergebnis für jeden Gegner ausgefüllt sind.'
      }
    }

    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }

    setOpen(true)
    setError('') // Fehler zurücksetzen
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container">
      <FormControl fullWidth margin="normal">
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="16px">
          {/* eigene ELO */}
          <TextField
            id="elo"
            type="text"
            inputMode="numeric"
            value={elo}
            onChange={(e) => setElo(e.target.value)}
            label="Alte ELO"
            variant="outlined"
            error={!!error && !elo}
            helperText={!!error && !elo ? 'Bitte alte ELO angeben' : ''}
          />

          {/* Geschlecht */}
          <FormControl variant="outlined" sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center">
              <InputLabel id="gender-label">Geschlecht (optional)</InputLabel>
              <Select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Geschlecht (optional)"
                fullWidth
                style={{ marginRight: '10px' }}
              >
                <MenuItem value="male">Männlich</MenuItem>
                <MenuItem value={FEMALE}>Weiblich</MenuItem>
              </Select>
              <Tooltip
                title={
                  <Box sx={{ padding: '5px', textAlign: 'center' }}>
                    Die Angabe des Geschlechts ist für die Normbestimmung erforderlich.
                  </Box>
                }
                arrow
              >
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </FormControl>
        </Box>
      </FormControl>

      {/* K-Faktor */}
      <FormControl fullWidth margin="normal">
        <Box display="flex" alignItems="center">
          <InputLabel id="k-factor-label">K-Faktor</InputLabel>
          <Select
            id="k-factor"
            value={kFactor}
            onChange={(e) => setKFactor(e.target.value)}
            label="K-Faktor"
            fullWidth
            style={{ marginRight: '10px' }}
            error={!!error && !kFactor} //select hat keine helpertext Option
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={40}>40</MenuItem>
          </Select>
          <Tooltip
            title={
              <Box sx={{ padding: '15px', textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                  }}
                >
                  Der K-Faktor ist:
                </div>
                <ul
                  style={{
                    padding: 0,
                    margin: 0,
                    textAlign: 'left',
                  }}
                >
                  <li>40 für Spieler unter 18 Jahren mit einer ELO &lt; 2300</li>
                  <li>10 für Spieler mit einer ELO &gt; 2400</li>
                  <li>
                    20 für alle anderen Spieler mit oder ohne ELO sowie für Blitz- und
                    Schnellpartien
                  </li>
                </ul>
              </Box>
            }
            arrow
            // Pfeil vom Tooltip
          >
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {!!error && !kFactor && (
          <Typography color="error" variant="caption">
            Bitte K-Faktor angeben
          </Typography>
        )}
      </FormControl>

      {matches.map((match, index) => (
        <Box key={index} className="match-box">
          <Typography className="match-label">{`${index + 1}. Gegner`}</Typography>

          {/* Gegner ELO */}
          <TextField
            label="ELO"
            type="text"
            inputMode="numeric"
            name="opponentElo"
            value={match.opponentElo}
            onChange={(e) => handleMatchChange(index, e)}
            variant="outlined"
            error={!!error && !match.opponentElo}
            helperText={!!error && !match.opponentElo ? 'Bitte ELO angeben' : ''}
          />

          {/* Ergebnis */}
          <FormControl className="result-select">
            <InputLabel id={`result-label-${index}`}>Ergebnis</InputLabel>
            <Select
              labelId={`result-label-${index}`}
              name="result"
              value={match.result}
              onChange={(e) => handleMatchChange(index, e)}
              label="Ergebnis"
              error={!!error && match.result === ''}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={0.5}>0.5</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </Select>
            {!!error && match.result === '' && (
              <Typography color="error" variant="caption">
                Ergebnis fehlt
              </Typography>
            )}
          </FormControl>

          {/* Entfernen Button */}
          <Button
            className="remove-button"
            variant="outlined"
            color="error"
            startIcon={<RemoveIcon />}
            onClick={() => handleRemoveMatch(index)}
          >
            Gegner Entfernen
          </Button>
        </Box>
      ))}

      <Box className="button-group">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddMatch}
        >
          Gegner hinzufügen
        </Button>

        <Button type="submit" variant="contained" color="success">
          Berechnen
        </Button>
      </Box>

      {!!error && (
        <Typography color="error" variant="body1" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      <Typography
        variant="body2"
        sx={{
          marginTop: 2,
          color: 'text.secondary',
          textAlign: 'left',
          '& span': {
            display: 'block',
            marginLeft: 1,
          },
        }}
      >
        <sup>*</sup> <strong>Performance:</strong> ELO des Gegners wird auf 2050 angehoben, wenn sie
        unter 2050 liegt. <br />
        <span>
          <strong>ELO Berechnung:</strong> Wenn die ELO des Gegners 400 Punkte unter der eigenen ELO
          liegt, wird die ELO des Gegners auf den Wert der eigenen ELO minus 400 gesetzt.
        </span>
      </Typography>

      <EloRechner
        open={open}
        handleClose={handleClose}
        elo={elo}
        kFactor={kFactor}
        matches={matches}
        gender={gender}
      />
    </Box>
  )
}

export default EloForm
