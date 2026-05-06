import { useState } from 'react';
import '../styles/GameForm.css';

export const GameForm = ({ players, onGameAdded }) => {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [winType, setWinType] = useState('black');
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]);

  const WIN_TYPES = [
    { value: 'black', label: 'Potted Black' },
    { value: 'foul', label: 'Opponent Foul' },
    { value: 'default', label: 'Default/No Show' },
    { value: 'concede', label: 'Opponent Conceded' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!player1Id || !player2Id || !winnerId || player1Id === player2Id) {
      alert('Please select two different players and a winner');
      return;
    }

    onGameAdded({
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

  const player2Options = players.filter(p => p.id !== player1Id);

  return (
    <div className="game-form">
      <h2>Record a Game</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="player1">Player 1</label>
          <select
            id="player1"
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
            required
          >
            <option value="">Select player...</option>
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="player2">Player 2</label>
          <select
            id="player2"
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
            required
            disabled={!player1Id}
          >
            <option value="">Select player...</option>
            {player2Options.filter(p => p.id !== player1Id).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="winner">Winner</label>
          <select
            id="winner"
            value={winnerId}
            onChange={(e) => setWinnerId(e.target.value)}
            required
            disabled={!player1Id || !player2Id}
          >
            <option value="">Select winner...</option>
            {player1Id && <option value={player1Id}>{players.find(p => p.id === player1Id)?.name}</option>}
            {player2Id && <option value={player2Id}>{players.find(p => p.id === player2Id)?.name}</option>}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="winType">Win Type</label>
          <select
            id="winType"
            value={winType}
            onChange={(e) => setWinType(e.target.value)}
          >
            {WIN_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">Record Game</button>
      </form>
    </div>
  );
};
