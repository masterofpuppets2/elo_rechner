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

const EloForm = () => {
  const [elo, setElo] = useState('')
  const [kFactor, setKFactor] = useState('')
  const [matches, setMatches] = useState([{ opponentElo: '', result: '' }])
  const [open, setOpen] = useState(false)

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

  const handleSubmit = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container">
      <FormControl fullWidth margin="normal">
        <TextField
          id="elo"
          type="text"
          inputMode="numeric"
          value={elo}
          onChange={(e) => setElo(e.target.value)}
          label="alte ELO"
          variant="outlined"
        />
      </FormControl>

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
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={0.5}>0.5</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </Select>
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

      <EloRechner
        open={open}
        handleClose={handleClose}
        elo={elo}
        kFactor={kFactor}
        matches={matches}
      />
    </Box>
  )
}

export default EloForm
