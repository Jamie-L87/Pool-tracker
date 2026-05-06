// CSV parsing utilities for importing pool tracker data

export const parsePlayersCSV = (csvText) => {
  const lines = csvText.replace(/\r\n/g, '\n').trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase()).filter(h => h);
  const nameIndex = headers.indexOf('name');
  const createdAtIndex = headers.indexOf('createdat');

  if (nameIndex === -1) {
    throw new Error('CSV must have a "name" column');
  }

  const players = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map(v => v.trim());
    const name = values[nameIndex];

    if (!name) {
      throw new Error(`Row ${i + 1}: Player name is required`);
    }

    players.push({
      id: Date.now().toString() + Math.random(), // Generate unique ID
      name: name.replace(/^["']|["']$/g, ''), // Remove quotes if any
      createdAt: createdAtIndex !== -1 && values[createdAtIndex] 
        ? values[createdAtIndex] 
        : new Date().toISOString(),
    });
  }

  return players;
};

export const parseGamesCSV = (csvText, players) => {
  const lines = csvText.replace(/\r\n/g, '\n').trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase()).filter(h => h);
  const player1Index = headers.indexOf('player1');
  const player2Index = headers.indexOf('player2');
  const winnerIndex = headers.indexOf('winner');
  const winTypeIndex = headers.indexOf('wintype');
  const dateIndex = headers.indexOf('date');

  if (player1Index === -1 || player2Index === -1 || winnerIndex === -1) {
    throw new Error('CSV must have "player1", "player2", and "winner" columns');
  }

  // Create a map of player names to IDs
  const playerMap = {};
  players.forEach(p => {
    playerMap[p.name.toLowerCase()] = p.id;
  });

  const games = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    
    const player1Name = values[player1Index];
    const player2Name = values[player2Index];
    const winnerName = values[winnerIndex];
    const winType = winTypeIndex !== -1 ? values[winTypeIndex] : 'black';
    const date = dateIndex !== -1 ? values[dateIndex] : new Date().toISOString();

    if (!player1Name || !player2Name || !winnerName) {
      throw new Error(`Row ${i + 1}: player1, player2, and winner are required`);
    }

    const player1Id = playerMap[player1Name.toLowerCase()];
    const player2Id = playerMap[player2Name.toLowerCase()];
    const winnerId = playerMap[winnerName.toLowerCase()];

    if (!player1Id) {
      throw new Error(`Row ${i + 1}: Player "${player1Name}" not found`);
    }
    if (!player2Id) {
      throw new Error(`Row ${i + 1}: Player "${player2Name}" not found`);
    }
    if (!winnerId) {
      throw new Error(`Row ${i + 1}: Winner "${winnerName}" not found`);
    }

    games.push({
      id: Date.now().toString() + Math.random(),
      player1Id,
      player2Id,
      winnerId,
      winType: winType || 'black',
      date,
    });
  }

  return games;
};

// Helper to validate CSV format
export const validateCSVFormat = (csvText, type) => {
  const lines = csvText.replace(/\r\n/g, '\n').trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase()).filter(h => h);

  if (type === 'players') {
    if (!headers.includes('name')) {
      throw new Error('Players CSV must have "name" column');
    }
  } else if (type === 'games') {
    if (!headers.includes('player1') || !headers.includes('player2') || !headers.includes('winner')) {
      throw new Error('Games CSV must have "player1", "player2", and "winner" columns');
    }
  }

  return true;
};
