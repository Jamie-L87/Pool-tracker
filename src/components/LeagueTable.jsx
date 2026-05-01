import '../styles/LeagueTable.css';

export const LeagueTable = ({ standings }) => {
  if (standings.length === 0) {
    return (
      <div className="league-table">
        <h2>League Table</h2>
        <p className="no-data">No players yet. Add some players to get started!</p>
      </div>
    );
  }

  return (
    <div className="league-table">
      <h2>League Table</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="rank">#</th>
              <th className="name">Player</th>
              <th>Played</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Points</th>
              <th>PPG</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((player, index) => (
              <tr key={player.id} className={index < 3 ? 'top-three' : ''}>
                <td className="rank">{index + 1}</td>
                <td className="name">{player.name}</td>
                <td>{player.played}</td>
                <td className="wins">{player.wins}</td>
                <td className="losses">{player.losses}</td>
                <td className="points">{player.points}</td>
                <td className="ppg">{player.pointsPerGame}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
