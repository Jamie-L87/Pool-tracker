import { useState, useEffect } from 'react';
import './styles/global.css';
import './App.css';
import { storageService } from './services/storage';
import { useLeagueData } from './hooks/useLeagueData';
import { LeagueTable } from './components/LeagueTable';
import { FormTable } from './components/FormTable';
import { GameForm } from './components/GameForm';
import { PlayerForm } from './components/PlayerForm';

function App() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('league');
  const { standings, refresh } = useLeagueData();


  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedPlayers = storageService.getPlayers();
    const loadedGames = storageService.getGames();
    setPlayers(loadedPlayers);
    setGames(loadedGames);
    refresh();
  };

  const handleAddPlayer = (name) => {
    const newPlayer = storageService.addPlayer(name);
    setPlayers([...players, newPlayer]);
  };

  const handleAddGame = ({ player1Id, player2Id, winnerId, winType, date }) => {
    storageService.addGame(player1Id, player2Id, winnerId, winType, date);
    const updatedGames = storageService.getGames();
    setGames(updatedGames);
    refresh();
    setActiveTab('league');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎱 Pool Tracker</h1>
          <p className="subtitle">Track player rankings and game results</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'league' ? 'active' : ''}`}
          onClick={() => setActiveTab('league')}
        >
          League Table
        </button>
        <button
          className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Recent Form
        </button>
        <button
          className={`nav-btn ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          Record Game
        </button>
        <button
          className={`nav-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players
        </button>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeTab === 'league' && (
            <LeagueTable standings={standings} />
          )}

          {activeTab === 'form' && (
            <FormTable players={players} games={games} />
          )}

          {activeTab === 'game' && (
            <GameForm players={players} onGameAdded={handleAddGame} />
          )}

          {activeTab === 'players' && (
            <PlayerForm players={players} onPlayerAdded={handleAddPlayer} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Pool Tracker. Track your games and climb the rankings!</p>
      </footer>
    </div>
  );
}

export default App;
