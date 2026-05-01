import { useState } from 'react';
import '../styles/PlayerForm.css';

export const PlayerForm = ({ onPlayerAdded, players }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    if (players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      alert('This player already exists');
      return;
    }

    onPlayerAdded(playerName);
    setPlayerName('');
  };

  return (
    <div className="player-form">
      <h2>Add New Player</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter player name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={50}
          />
          <button type="submit" className="btn-primary">Add Player</button>
        </div>
      </form>
      {players.length > 0 && (
        <div className="players-list">
          <h3>Current Players ({players.length})</h3>
          <ul>
            {players.map(player => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
