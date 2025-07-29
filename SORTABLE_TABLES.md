# Sortable Tables Feature

## Overview

All stats tables throughout the application are now sortable. Users can click on any column header to sort the data by that column. Clicking the same header again will reverse the sort order.

## Implementation

### SortableTable Component

A reusable `SortableTable` component has been created at `client/src/components/SortableTable.js` that provides:

- **Clickable headers**: All column headers are clickable and show sort indicators
- **Sort indicators**: Visual icons (FaSort, FaSortUp, FaSortDown) indicate current sort state
- **Nested object support**: Can sort by nested properties like `player.full_name`
- **Smart data handling**: Automatically handles null/undefined values and different data types
- **Consistent styling**: Matches the application's design theme

### Usage

```jsx
import SortableTable from '../components/SortableTable';

const columns = [
  { key: 'player.full_name', label: 'Player' },
  { key: 'batting_average', label: 'AVG' },
  { key: 'hits', label: 'H' },
  { key: 'home_runs', label: 'HR' }
];

<SortableTable
  data={statsData}
  columns={columns}
  defaultSort="batting_average"
  defaultSortDirection="desc"
/>
```

### Column Configuration

Each column object supports:
- `key`: The data property to sort by (supports nested properties like `player.full_name`)
- `label`: The display text for the column header
- `sortable`: Optional boolean to disable sorting for specific columns (defaults to true)
- `render`: Optional function to customize how the data is displayed

## Updated Pages

### 1. Stats Page (`/stats`)
- **Batting Leaders Table**: Sortable by Player, AVG, H, HR, RBI, R, SB
- **Pitching Leaders Table**: Sortable by Player, W, L, ERA, IP, SO, S
- **Default sorts**: Batting average (descending), ERA (ascending)

### 2. Game Detail Page (`/game/:id`)
- **Player Statistics Table**: Sortable by Player, AB, H, R, RBI, AVG
- **Default sort**: Player name (ascending)

### 3. Player Detail Page (`/player/:id`)
- **Game Log Table**: Sortable by Date, Opponent, AB, H, R, RBI, AVG
- **Default sort**: Date (descending) to show most recent games first

## Features

### Visual Indicators
- **Unsorted columns**: Show a neutral sort icon (FaSort)
- **Sorted columns**: Show up/down arrows (FaSortUp/FaSortDown)
- **Hover effects**: Headers change background color on hover

### Smart Sorting
- **Numbers**: Sorted numerically (e.g., batting averages, home runs)
- **Text**: Sorted alphabetically (e.g., player names)
- **Null values**: Handled gracefully and sorted to the end
- **Nested properties**: Supports complex data structures

### User Experience
- **Intuitive**: Click any header to sort
- **Reversible**: Click same header to reverse sort order
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper keyboard navigation support

## Technical Details

### State Management
The component uses React's `useState` and `useMemo` hooks for efficient sorting:
- Sort configuration is stored in state
- Sorted data is memoized to prevent unnecessary re-computations
- Only re-sorts when data or sort configuration changes

### Performance
- **Efficient sorting**: Uses native JavaScript sort with optimized comparison
- **Memoization**: Prevents unnecessary re-renders
- **Minimal re-renders**: Only updates when sort state changes

### Styling
- **Consistent theme**: Matches the application's color scheme
- **Responsive design**: Works on mobile and desktop
- **Smooth transitions**: Hover effects and sort animations

## Future Enhancements

Potential improvements that could be added:
- **Multi-column sorting**: Sort by multiple columns
- **Custom sort functions**: Allow custom sorting logic per column
- **Persistent sorting**: Remember user's sort preferences
- **Export functionality**: Export sorted data to CSV/Excel
- **Filtering**: Add column filters alongside sorting 