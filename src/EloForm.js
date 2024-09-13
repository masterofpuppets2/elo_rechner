import React, { useState } from 'react'
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import './EloForm.css'
import EloRechner from './EloRechner'

const EloForm = () => {
  const [elo, setElo] = useState('')
  const [kFactor, setKFactor] = useState('')
  const [matches, setMatches] = useState([{ opponentElo: '', result: '' }])
  const [open, setOpen] = useState(false);  

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
    setOpen(true); 
  }

  const handleClose = () => {
    setOpen(false);
  };  

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container">
      <FormControl fullWidth margin="normal">
        <TextField
          id="elo"
          type="text"
          inputMode="numeric"
          value={elo}
          onChange={(e) => setElo(e.target.value)}
          label="eigene ELO Zahl"
          variant="outlined"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="k-factor-label">K-Faktor</InputLabel>
        <Select
          id="k-factor"
          value={kFactor}
          onChange={(e) => setKFactor(e.target.value)}
          label="K-Faktor"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={40}>40</MenuItem>
        </Select>
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

        <Button
          type="submit"
          variant="contained"
          color="success"
        >
          Berechnen
        </Button>
      </Box>

      <EloRechner open={open} handleClose={handleClose} elo={elo} kFactor={kFactor} matches={matches} />  
    </Box>
  )
}

export default EloForm
