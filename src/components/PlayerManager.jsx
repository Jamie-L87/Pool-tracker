import { useState } from 'react';
import '../styles/PlayerManager.css';

export const PlayerManager = ({ players, onPlayerAdded }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = playerName.trim();
    if (!trimmed) {
      setError('Please enter a player name');
      return;
    }

    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('This player already exists');
      return;
    }

    onPlayerAdded(trimmed);
    setPlayerName('');
  };

  return (
    <div className="player-manager">
      <div className="player-manager__header">
        <h2>Manage Players</h2>
        <p className="player-manager__subtitle">Add new players to get started</p>
      </div>

      <div className="player-manager__form-section">
        <form onSubmit={handleSubmit} className="player-manager__form">
          <input
            type="text"
            placeholder="Enter player name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={50}
            className="player-manager__input"
          />
          <button type="submit" className="btn-primary">Add Player</button>
        </form>
        {error && <div className="player-manager__error">{error}</div>}
      </div>

      {players.length > 0 && (
        <div className="player-manager__list-section">
          <h3>Current Players ({players.length})</h3>
          <div className="player-manager__list">
            {players.map(player => (
              <div key={player.id} className="player-manager__card">
                {player.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {players.length === 0 && (
        <div className="player-manager__empty">
          <p>No players yet. Add your first player above!</p>
        </div>
      )}
    </div>
  );
};
