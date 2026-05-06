import { useState, useEffect } from 'react';
import './styles/global.css';
import './App.css';
import { storageService } from './services/storage';
import { useLeagueData } from './hooks/useLeagueData';
import { LeagueTable } from './components/LeagueTable';
import { FormTable } from './components/FormTable';
import { PlayerManager } from './components/PlayerManager';
import { GameRecorder } from './components/GameRecorder';

function App() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('league');
  const [navOpen, setNavOpen] = useState(false);
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

  const handleImportPlayers = (importedPlayers) => {
    const result = storageService.importPlayers(importedPlayers);
    const updatedPlayers = storageService.getPlayers();
    setPlayers(updatedPlayers);
    
    const message = result.duplicates > 0
      ? `✓ Imported ${result.imported} new player(s), ${result.duplicates} duplicate(s) skipped`
      : `✓ Successfully imported ${result.imported} player(s)`;
    alert(message);
  };

  const handleImportGames = (importedGames) => {
    const result = storageService.importGames(importedGames);
    const updatedGames = storageService.getGames();
    setGames(updatedGames);
    refresh();
    
    const message = result.duplicates > 0
      ? `✓ Imported ${result.imported} new game(s), ${result.duplicates} duplicate(s) skipped`
      : `✓ Successfully imported ${result.imported} game(s)`;
    alert(message);
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    setNavOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle menu">
          {navOpen ? '✕' : '☰'}
        </button>
        <h1>🎱 Pool Tracker</h1>
        <p className="subtitle">Track player rankings and game results</p>
      </header>

      <div className="app-body">
        <div className={`nav-overlay ${navOpen ? 'open' : ''}`} onClick={() => setNavOpen(false)} />

        <nav className={`app-nav ${navOpen ? 'open' : ''}`}>
          <span className="nav-section-label">Overview</span>
          <button
            className={`nav-btn ${activeTab === 'league' ? 'active' : ''}`}
            onClick={() => navigate('league')}
          >
            <span className="nav-icon">🏆</span> League Table
          </button>
          <button
            className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => navigate('form')}
          >
            <span className="nav-icon">📊</span> Recent Form
          </button>

          <span className="nav-section-label">Manage</span>
          <button
            className={`nav-btn ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => navigate('game')}
          >
            <span className="nav-icon">🎱</span> Record Game
          </button>
          <button
            className={`nav-btn ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => navigate('players')}
          >
            <span className="nav-icon">👥</span> Players
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
              <GameRecorder players={players} onGameRecorded={handleAddGame} />
            )}

            {activeTab === 'players' && (
              <PlayerManager players={players} onPlayerAdded={handleAddPlayer} />
            )}
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <p>&copy; 2026 Pool Tracker. Track your games and climb the rankings!</p>
      </footer>
    </div>
  );
}

export default App;
