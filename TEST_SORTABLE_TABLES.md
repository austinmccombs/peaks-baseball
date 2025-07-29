# Test Guide: Sortable Tables

## Issue Fixed
The player names were not showing up in the sortable tables because the SortableTable component wasn't properly handling nested properties (like `player.full_name`) in the cell rendering.

## Fix Applied
Updated the SortableTable component to use a `getNestedValue` helper function that properly handles nested properties both for sorting and for displaying data.

## Test Cases

### 1. Stats Page (`/stats`)
**Test Steps:**
1. Navigate to `/stats`
2. Check that player names appear in both Batting Leaders and Pitching Leaders tables
3. Click on "Player" column header to sort by player name
4. Click on "AVG" column header to sort by batting average
5. Verify that sort icons appear and change direction when clicked

**Expected Results:**
- Player names should be visible (e.g., "John Smith", "Mike Johnson")
- Clicking column headers should sort the data
- Sort icons should show current sort state

### 2. Game Detail Page (`/game/:id`)
**Test Steps:**
1. Navigate to `/games` and click on a game
2. Check that player names appear in the Player Statistics table
3. Click on "Player" column header to sort by player name
4. Click on "AVG" column header to sort by batting average

**Expected Results:**
- Player names should be visible in the stats table
- Sorting should work correctly

### 3. Player Detail Page (`/player/:id`)
**Test Steps:**
1. Navigate to `/roster` and click on a player
2. Go to the Stats tab
3. Check that the Game Log table shows player stats with dates and opponents
4. Click on "Date" column header to sort by date
5. Click on "Opponent" column header to sort by opponent

**Expected Results:**
- Game log should show dates, opponents, and stats
- Sorting should work correctly

## API Data Structure
The API returns data with nested player objects:
```json
{
  "player": {
    "first_name": "John",
    "last_name": "Smith", 
    "full_name": "John Smith",
    "jersey_number": 1
  },
  "at_bats": 3,
  "hits": 1,
  "batting_average": 0.333
}
```

## Column Configuration
Tables use nested property keys like:
- `player.full_name` for player names
- `game.short_date` for game dates
- `game.opponent` for opponents

## Technical Details
The fix involved:
1. Creating a `getNestedValue` helper function
2. Using this function for both sorting and cell rendering
3. Properly handling null/undefined values
4. Maintaining the existing sort icon functionality

## Verification
To verify the fix is working:
1. Check browser console for any JavaScript errors
2. Verify that all player names are displayed correctly
3. Test sorting functionality on all tables
4. Ensure sort icons appear and change appropriately 