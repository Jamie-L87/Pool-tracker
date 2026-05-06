import { useState } from 'react';
import '../styles/GameRecorder.css';

export const GameRecorder = ({ players, onGameRecorded }) => {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [winType, setWinType] = useState('black');
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const WIN_TYPES = [
    { value: 'black', label: 'Potted Black' },
    { value: 'foul', label: 'Opponent Foul' },
    { value: 'default', label: 'Default/No Show' },
    { value: 'concede', label: 'Opponent Conceded' },
  ];

  const player2Options = players.filter(p => p.id !== player1Id);
  const winnerOptions = [
    ...(player1Id ? [players.find(p => p.id === player1Id)] : []),
    ...(player2Id ? [players.find(p => p.id === player2Id)] : []),
  ].filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!player1Id || !player2Id || !winnerId) {
      setError('Please select both players and a winner');
      return;
    }

    if (player1Id === player2Id) {
      setError('Players must be different');
      return;
    }

    onGameRecorded({
      player1Id,
      player2Id,
      winnerId,
      winType,
      date: new Date(gameDate).toISOString(),
    });

    // Reset form
    setPlayer1Id('');
    setPlayer2Id('');
    setWinnerId('');
    setWinType('black');
    setGameDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="game-recorder">
      <div className="game-recorder__header">
        <h2>Record a Game</h2>
        <p className="game-recorder__subtitle">Track match results</p>
      </div>

      <form onSubmit={handleSubmit} className="game-recorder__form">
        <div className="game-recorder__section">
          <div className="form-field">
            <label htmlFor="player1">Player 1</label>
            <select
              id="player1"
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="form-select"
            >
              <option value="">Select player...</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="player2">Player 2</label>
            <select
              id="player2"
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="form-select"
              disabled={!player1Id}
            >
              <option value="">Select player...</option>
              {player2Options.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="game-recorder__section">
          <div className="form-field">
            <label htmlFor="winner">Winner</label>
            <select
              id="winner"
              value={winnerId}
              onChange={(e) => setWinnerId(e.target.value)}
              className="form-select"
              disabled={!player1Id || !player2Id}
            >
              <option value="">Select winner...</option>
              {winnerOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="winType">Win Type</label>
            <select
              id="winType"
              value={winType}
              onChange={(e) => setWinType(e.target.value)}
              className="form-select"
            >
              {WIN_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="game-recorder__section">
          <div className="form-field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {error && <div className="game-recorder__error">{error}</div>}

        <button type="submit" className="btn-primary game-recorder__submit">
          Record Game
        </button>
      </form>
    </div>
  );
};
