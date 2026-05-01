import { useState, useEffect } from 'react';
import { storageService } from '../services/storage';

export const useLeagueData = () => {
  const [standings, setStandings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    calculateStandings();
  }, [lastUpdate]);

  const calculateStandings = () => {
    const players = storageService.getPlayers();
    const games = storageService.getGames();

    const standings = players.map(player => {
      const playerGames = games.filter(
        g => g.player1Id === player.id || g.player2Id === player.id
      );

      const wins = playerGames.filter(g => g.winnerId === player.id).length;
      const losses = playerGames.filter(g => g.winnerId !== player.id && (g.player1Id === player.id || g.player2Id === player.id)).length;
      const total = playerGames.length;
      const points = wins * 2; // 2 points for a win, 0 for a loss

      return {
        id: player.id,
        name: player.name,
        played: total,
        wins,
        losses,
        points,
        pointsPerGame: total > 0 ? (points / total).toFixed(2) : 0,
      };
    });

    // Sort by points (descending), then by pointsPerGame
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return parseFloat(b.pointsPerGame) - parseFloat(a.pointsPerGame);
    });

    setStandings(standings);
  };

  const refresh = () => setLastUpdate(Date.now());

  return { standings, refresh };
};

export const useFormData = (playerId) => {
  const [formGames, setFormGames] = useState([]);

  useEffect(() => {
    const games = storageService.getGames();
    const playerGames = games
      .filter(g => g.player1Id === playerId || g.player2Id === playerId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Last 10 games

    const players = storageService.getPlayers();
    const playerMap = {};
    players.forEach(p => (playerMap[p.id] = p.name));

    const enriched = playerGames.map(game => ({
      ...game,
      opponent: game.player1Id === playerId 
        ? playerMap[game.player2Id] 
        : playerMap[game.player1Id],
      result: game.winnerId === playerId ? 'W' : 'L',
    }));

    setFormGames(enriched);
  }, [playerId]);

  return formGames;
};

export const usePlayerStats = (playerId) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const players = storageService.getPlayers();
    const games = storageService.getGames();

    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const playerGames = games.filter(
      g => g.player1Id === playerId || g.player2Id === playerId
    );

    const wins = playerGames.filter(g => g.winnerId === playerId).length;
    const losses = playerGames.filter(g => g.winnerId !== playerId && (g.player1Id === playerId || g.player2Id === playerId)).length;
    const total = playerGames.length;

    // Win types
    const winTypes = {};
    playerGames
      .filter(g => g.winnerId === playerId)
      .forEach(g => {
        winTypes[g.winType] = (winTypes[g.winType] || 0) + 1;
      });

    setStats({
      name: player.name,
      played: total,
      wins,
      losses,
      winRate: total > 0 ? ((wins / total) * 100).toFixed(1) : 0,
      points: wins * 2,
      winTypes,
    });
  }, [playerId]);

  return stats;
};
