import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const EloForm = () => {
  const [elo, setElo] = useState('');
  const [kFactor, setKFactor] = useState('');
  const [matches, setMatches] = useState([{ opponentElo: '', result: '' }]);

  const handleAddMatch = () => {
    setMatches([...matches, { opponentElo: '', result: '' }]);
  };

  const handleRemoveMatch = (index) => {
    const newMatches = matches.filter((_, i) => i !== index);
    setMatches(newMatches);
  };

  const handleMatchChange = (index, event) => {
    const { name, value } = event.target;
    const newMatches = [...matches];
    newMatches[index][name] = value;
    setMatches(newMatches);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Hier kannst du die Daten verarbeiten, z.B. an einen Server senden
    console.log({ elo, kFactor, matches });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="elo-label">ELO Zahl</InputLabel>
        <TextField
          id="elo"
          type="number"
          value={elo}
          onChange={(e) => setElo(e.target.value)}
          label="ELO Zahl"
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
        <Box key={index} sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label={`Gegner ELO ${index + 1}`}
            type="number"
            name="opponentElo"
            value={match.opponentElo}
            onChange={(e) => handleMatchChange(index, e)}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label={`Ergebnis ${index + 1}`}
            type="number"
            name="result"
            value={match.result}
            onChange={(e) => handleMatchChange(index, e)}
            variant="outlined"
          />
          <Button
            variant="outlined"
            color="error"
            startIcon={<RemoveIcon />}
            onClick={() => handleRemoveMatch(index)}
            sx={{ marginTop: 1 }}
          >
            Entfernen
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddMatch}
      >
        Feldpaar hinzufügen
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="success"
        sx={{ marginTop: 2 }}
      >
        Absenden
      </Button>
    </Box>
  );
};

export default EloForm;

