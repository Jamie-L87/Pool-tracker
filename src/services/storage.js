// LocalStorage management service for Pool Tracker data
const STORAGE_KEYS = {
  PLAYERS: 'pool_players',
  GAMES: 'pool_games',
};

export const storageService = {
  // Players
  getPlayers: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  },

  addPlayer: (name) => {
    const players = storageService.getPlayers();
    const newPlayer = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    players.push(newPlayer);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    return newPlayer;
  },

  deletePlayer: (playerId) => {
    const players = storageService.getPlayers();
    const filtered = players.filter(p => p.id !== playerId);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(filtered));
    
    // Also remove all games involving this player
    const games = storageService.getGames();
    const filteredGames = games.filter(g => g.player1Id !== playerId && g.player2Id !== playerId);
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(filteredGames));
  },

  // Games
  getGames: () => {
    const data = localStorage.getItem(STORAGE_KEYS.GAMES);
    return data ? JSON.parse(data) : [];
  },

  addGame: (player1Id, player2Id, winnerId, winType, date = new Date().toISOString()) => {
    const games = storageService.getGames();
    const newGame = {
      id: Date.now().toString(),
      player1Id,
      player2Id,
      winnerId,
      winType, // 'black', 'foul', 'default', etc.
      date,
    };
    games.push(newGame);
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    return newGame;
  },

  deleteGame: (gameId) => {
    const games = storageService.getGames();
    const filtered = games.filter(g => g.id !== gameId);
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(filtered));
  },

  // Clear all data (for testing)
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.PLAYERS);
    localStorage.removeItem(STORAGE_KEYS.GAMES);
  },

  // Export data
  exportData: () => {
    return {
      players: storageService.getPlayers(),
      games: storageService.getGames(),
    };
  },

  // Import data
  importData: (data) => {
    if (data.players) {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(data.players));
    }
    if (data.games) {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(data.games));
    }
  },

  // Merge imported players with existing players (deduplication by name)
  importPlayers: (importedPlayers) => {
    const existingPlayers = storageService.getPlayers();
    const existingNames = new Set(existingPlayers.map(p => p.name.toLowerCase()));
    
    // Filter out duplicates
    const newPlayers = importedPlayers.filter(
      ip => !existingNames.has(ip.name.toLowerCase())
    );

    // Combine and save
    const allPlayers = [...existingPlayers, ...newPlayers];
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(allPlayers));
    
    return {
      imported: newPlayers.length,
      duplicates: importedPlayers.length - newPlayers.length,
      total: allPlayers.length,
    };
  },

  // Merge imported games with existing games (deduplication by date, players, and winner)
  importGames: (importedGames) => {
    const existingGames = storageService.getGames();
    
    // Create a set of existing game signatures for deduplication
    const existingSignatures = new Set(
      existingGames.map(g => `${g.player1Id}_${g.player2Id}_${g.winnerId}_${g.date}`)
    );

    // Filter out duplicates
    const newGames = importedGames.filter(ig => {
      const signature = `${ig.player1Id}_${ig.player2Id}_${ig.winnerId}_${ig.date}`;
      return !existingSignatures.has(signature);
    });

    // Combine and save
    const allGames = [...existingGames, ...newGames];
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(allGames));

    return {
      imported: newGames.length,
      duplicates: importedGames.length - newGames.length,
      total: allGames.length,
    };
  },
};
