# Pool Tracker - Data Import Guide

## Overview
Pool Tracker supports importing historical data from past seasons. You can import player lists and game results separately using CSV files.

## Getting Started

1. Go to the **Players** tab
2. Scroll down to **Import Past Data**
3. Choose whether to import Players or Games
4. Select your CSV file

## Import Formats

### Players CSV
Import a list of players to add to your league.

**Columns:**
- `name` (required) - Player's name
- `createdAt` (optional) - When the player joined (ISO format: YYYY-MM-DDTHH:mm:ssZ)

**Example:**
```csv
name,createdAt
John Doe,2025-01-01T00:00:00Z
Jane Smith,2025-01-01T00:00:00Z
Mike Johnson,2025-01-02T00:00:00Z
```

If `createdAt` is omitted, today's date will be used.

### Games CSV
Import game results for players already in the system.

**Columns:**
- `player1` (required) - First player's name
- `player2` (required) - Second player's name
- `winner` (required) - Winner's name (must match player1 or player2)
- `winType` (optional) - How the game was won
- `date` (optional) - When the game occurred (ISO format)

**Supported Win Types:**
- `black` - Potted the black ball
- `foul` - Opponent fouled (default if not specified)
- `default` - Opponent did not show up
- `concede` - Opponent conceded/gave up

**Example:**
```csv
player1,player2,winner,winType,date
John Doe,Jane Smith,John Doe,black,2025-01-05T14:30:00Z
Jane Smith,Mike Johnson,Jane Smith,foul,2025-01-05T15:00:00Z
John Doe,Mike Johnson,John Doe,black,2025-01-06T14:00:00Z
```

If `winType` is omitted, `black` is used as the default.
If `date` is omitted, today's date will be used.

## Sample Files

Sample CSV files are included in the repository:
- `sample-players.csv` - Example player import
- `sample-games.csv` - Example game import

## Import Behavior

### Merging vs Replacing
- **Players**: Duplicate player names are skipped (case-insensitive). New players are added.
- **Games**: Duplicate games (same players, winner, and date) are skipped. New games are added.

### Validation
The importer will validate:
- Required columns are present
- Player names in games exist in the system
- Winner names match one of the two players

## Tips

1. **Always add players first** - Games reference players, so import players before games.
2. **Use consistent names** - Make sure player names match exactly between the players and games CSV.
3. **ISO date format** - Use `YYYY-MM-DDTHH:mm:ssZ` format for dates (e.g., `2025-01-05T14:30:00Z`)
4. **Quotes** - The importer handles quoted values automatically.

## Troubleshooting

**"Player not found" error:**
- Check that the player name in the games CSV exactly matches the name in your players list.
- Player names are case-sensitive when referencing them in games.

**"CSV must have..." error:**
- Make sure your CSV has the required columns.
- Check column names are exactly as specified (case-insensitive, but must match).

**Duplicate entries not imported:**
- This is by design to prevent accidental duplicates.
- If you want to re-import, you can manually delete and re-import.

## Creating Your CSV

You can use any spreadsheet application:
1. Create your data in Excel or Google Sheets
2. Save as CSV (comma-separated values)
3. Import using the Pool Tracker app

Or create manually in a text editor with proper CSV formatting.
