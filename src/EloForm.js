import './EloForm.css'
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
    const numberRegex = /^[0-9]+$/

    if (!elo || !kFactor) {
      return 'Bitte geben Sie alle erforderlichen Informationen ein.'
    }

    if (!numberRegex.test(elo)) {
      return 'Die alte ELO muss eine gültige Zahl sein.'
    }

    for (const match of matches) {
      if (!match.opponentElo || match.result === '') {
        //!match.result würde nicht funktionieren, da es bei Ergebnis 0 auch einen Fehler werfen würde
        return 'Bitte stellen Sie sicher, dass sowohl die ELO des Gegners als auch das Ergebnis für jeden Gegner ausgefüllt sind.'
      }
      if (!numberRegex.test(match.opponentElo)) {
        return 'Die ELO des Gegners muss eine gültige Zahl sein.'
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
    <Box component="form" onSubmit={handleSubmit} className="start-container">
      <FormControl fullWidth margin="normal">
        <Box className="first-box">
          {/* eigene ELO */}
          <TextField
            id="elo"
            type="text"
            inputMode="numeric"
            value={elo}
            onChange={(e) => setElo(e.target.value)}
            variant="outlined"
            label="Alte ELO"
            error={!!error && (!elo || isNaN(elo))}
            helperText={
              !!error
                ? !elo
                  ? 'Bitte alte ELO angeben'
                  : isNaN(elo)
                    ? 'Bitte gültige alte ELO angeben'
                    : ''
                : ''
            }
            className="centered-text-field"
          />

          {/* Geschlecht */}
          <FormControl className="outlined-form-control">
            <Box className="box">
              <InputLabel id="gender">Geschlecht (optional)</InputLabel>
              <Select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Geschlecht (optional)"
                fullWidth
                className="margin-right"
              >
                <MenuItem value="male">Männlich</MenuItem>
                <MenuItem value={FEMALE}>Weiblich</MenuItem>
              </Select>
              <Tooltip
                title={
                  <Box className="gender-tooltip">
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
        <Box className="box">
          <InputLabel id="k-factor-label">K-Faktor</InputLabel>
          <Select
            id="k-factor"
            value={kFactor}
            onChange={(e) => setKFactor(e.target.value)}
            label="K-Faktor"
            fullWidth
            error={!!error && !kFactor} //select hat keine helpertext Option
            className="margin-right"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={40}>40</MenuItem>
          </Select>
          <Tooltip
            title={
              <Box className="tooltip-content">
                <div className="tooltip-heading">Der K-Faktor ist:</div>
                <ul className="tooltip-list">
                  <li>40 für Spieler unter 18 Jahren mit einer ELO &lt; 2300</li>
                  <li>10 für Spieler mit einer ELO &gt; 2400</li>
                  <li>
                    20 für alle anderen Spieler mit oder ohne ELO sowie für Blitz- und
                    Schnellpartien
                  </li>
                </ul>
              </Box>
            }
            arrow // Pfeil vom Tooltip
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
            error={!!error && (!match.opponentElo || isNaN(match.opponentElo))}
            helperText={
              !!error
                ? !match.opponentElo
                  ? 'Bitte ELO angeben'
                  : isNaN(match.opponentElo)
                    ? 'Bitte gültige ELO angeben'
                    : ''
                : ''
            }
            className="centered-text-field"
          />

          {/* Ergebnis */}
          <FormControl className="result-width">
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
            variant="outlined"
            color="error"
            startIcon={<RemoveIcon />}
            onClick={() => handleRemoveMatch(index)}
            className="remove-button"
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
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Typography variant="body2" className="hint">
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
