import { useState } from 'react';
import { parsePlayersCSV, parseGamesCSV, validateCSVFormat } from '../utils/csvParser';
import '../styles/ImportData.css';

export const ImportData = ({ onPlayersImported, onGamesImported, existingPlayers }) => {
  const [importType, setImportType] = useState('players');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const csvText = await file.text();

      if (importType === 'players') {
        validateCSVFormat(csvText, 'players');
        const players = parsePlayersCSV(csvText);
        onPlayersImported(players);
        setSuccess(`✓ Successfully imported ${players.length} player(s)`);
      } else if (importType === 'games') {
        if (existingPlayers.length === 0) {
          throw new Error('You must have players before importing games');
        }
        validateCSVFormat(csvText, 'games');
        const games = parseGamesCSV(csvText, existingPlayers);
        onGamesImported(games);
        setSuccess(`✓ Successfully imported ${games.length} game(s)`);
      }

      // Reset file input
      event.target.value = '';
    } catch (err) {
      setError(`✗ Import failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-data">
      <h3>Import Past Data</h3>
      
      <div className="import-tabs">
        <button
          className={`import-tab ${importType === 'players' ? 'active' : ''}`}
          onClick={() => setImportType('players')}
        >
          Import Players
        </button>
        <button
          className={`import-tab ${importType === 'games' ? 'active' : ''}`}
          onClick={() => setImportType('games')}
        >
          Import Games
        </button>
      </div>

      <div className="import-section">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
            id="csv-upload"
            className="file-input"
          />
          <label htmlFor="csv-upload" className="file-label">
            {loading ? 'Processing...' : 'Choose CSV file'}
          </label>
        </div>

        {error && <div className="import-error">{error}</div>}
        {success && <div className="import-success">{success}</div>}

        <div className="import-info">
          {importType === 'players' ? (
            <div>
              <p><strong>Players CSV Format:</strong></p>
              <code>
                name,createdAt<br/>
                John Doe,2025-01-01T00:00:00Z<br/>
                Jane Smith,2025-01-01T00:00:00Z
              </code>
              <p className="note"><strong>Note:</strong> createdAt is optional</p>
            </div>
          ) : (
            <div>
              <p><strong>Games CSV Format:</strong></p>
              <code>
                player1,player2,winner,winType,date<br/>
                John Doe,Jane Smith,John Doe,black,2025-01-05T00:00:00Z<br/>
                Jane Smith,John Doe,Jane Smith,foul,2025-01-06T00:00:00Z
              </code>
              <p className="note"><strong>Note:</strong> winType and date are optional (defaults: black, today)</p>
              <p className="note"><strong>Win Types:</strong> black, foul, default, concede</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
