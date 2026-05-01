import '../styles/FormTable.css';

export const FormTable = ({ players, games }) => {
  if (players.length === 0) {
    return (
      <div className="form-table">
        <h2>Recent Form</h2>
        <p className="no-data">No games recorded yet.</p>
      </div>
    );
  }

  // Create a map of player names
  const playerMap = {};
  players.forEach(p => (playerMap[p.id] = p.name));

  // Group games by player
  const playerForm = {};
  players.forEach(player => {
    playerForm[player.id] = {
      name: player.name,
      form: [],
    };
  });

  // Get all games sorted by date
  const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50);

  sortedGames.forEach(game => {
    if (playerForm[game.player1Id]) {
      const result = game.winnerId === game.player1Id ? 'W' : 'L';
      playerForm[game.player1Id].form.push({ result, winType: game.winType, date: game.date });
    }
    if (playerForm[game.player2Id]) {
      const result = game.winnerId === game.player2Id ? 'W' : 'L';
      playerForm[game.player2Id].form.push({ result, winType: game.winType, date: game.date });
    }
  });

  return (
    <div className="form-table">
      <h2>Recent Form</h2>
      <div className="form-grid">
        {players.map(player => (
          <div key={player.id} className="player-form">
            <h3>{player.name}</h3>
            <div className="form-row">
              {playerForm[player.id].form.slice(0, 10).map((game, idx) => (
                <div
                  key={idx}
                  className={`form-badge ${game.result === 'W' ? 'win' : 'loss'}`}
                  title={`${game.result} (${game.winType}) - ${new Date(game.date).toLocaleDateString()}`}
                >
                  {game.result}
                </div>
              ))}
            </div>
            {playerForm[player.id].form.length === 0 && (
              <p className="no-games">No games yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
