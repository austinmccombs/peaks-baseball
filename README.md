# Peaks Baseball Team Website

A comprehensive website for managing a competitive little league baseball team, built with Ruby on Rails API backend and React frontend.

## Features

- **Player Management**: Complete roster with player profiles, statistics, and game logs
- **Game Tracking**: Record games, scores, and individual player performance
- **Statistics**: Comprehensive batting and pitching statistics with leaderboards
- **Video Highlights**: Upload and manage player video highlights with YouTube integration
- **Responsive Design**: Modern, mobile-friendly interface with team branding
- **Admin Panel**: Easy management of players, games, stats, and highlights

## Tech Stack

### Backend
- **Ruby on Rails 6.1** - API-only application
- **PostgreSQL** - Database
- **Active Model Serializers** - JSON API responses
- **Rack CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - User interface
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API communication
- **React Player** - Video player for highlights

## Color Scheme

Based on the team logo:
- **Primary Background**: Warm tan/beige (#D4C2A7)
- **Primary Text**: Dark charcoal (#2C2C2C)
- **Accent Color**: Brown (#8B4513)
- **Secondary Background**: Light tan (#E0D0B8)

## Setup Instructions

### Prerequisites

- Ruby 2.5.0 or higher
- PostgreSQL
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. **Install Ruby dependencies**:
   ```bash
   bundle install
   ```

2. **Setup database**:
   ```bash
   # Create and setup database
   rails db:create
   rails db:migrate
   ```

3. **Start the Rails server**:
   ```bash
   rails server -p 3001
   ```

The API will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Players
- `GET /api/v1/players` - Get all players
- `GET /api/v1/players/:id` - Get player details
- `POST /api/v1/players` - Create new player
- `PUT /api/v1/players/:id` - Update player
- `DELETE /api/v1/players/:id` - Deactivate player
- `GET /api/v1/players/:id/highlights` - Get player highlights
- `GET /api/v1/players/:id/stats` - Get player stats
- `GET /api/v1/players/:id/game_log` - Get player game log
- `GET /api/v1/roster/stats` - Get roster with season stats

### Games
- `GET /api/v1/games` - Get all games
- `GET /api/v1/games/:id` - Get game details
- `POST /api/v1/games` - Create new game
- `PUT /api/v1/games/:id` - Update game
- `DELETE /api/v1/games/:id` - Delete game
- `GET /api/v1/games/:id/stats` - Get game statistics

### Stats
- `GET /api/v1/stats` - Get all stats
- `GET /api/v1/stats/:id` - Get stat details
- `POST /api/v1/stats` - Create new stat
- `PUT /api/v1/stats/:id` - Update stat
- `DELETE /api/v1/stats/:id` - Delete stat
- `GET /api/v1/season/stats` - Get season statistics

### Highlights
- `GET /api/v1/highlights` - Get all highlights
- `GET /api/v1/highlights/:id` - Get highlight details
- `POST /api/v1/highlights` - Create new highlight
- `PUT /api/v1/highlights/:id` - Update highlight
- `DELETE /api/v1/highlights/:id` - Delete highlight

## Database Schema

### Players
- `id` - Primary key
- `first_name` - Player's first name
- `last_name` - Player's last name
- `jersey_number` - Player's jersey number (unique)
- `position` - Player's position (P, C, 1B, 2B, 3B, SS, LF, CF, RF, DH)
- `bio` - Player biography
- `height_inches` - Player height in inches
- `weight_lbs` - Player weight in pounds
- `birth_date` - Player birth date
- `active` - Whether player is active on roster
- `photo_url` - URL to player photo

### Games
- `id` - Primary key
- `opponent` - Opposing team name
- `game_date` - Date of the game
- `season` - Season year
- `home_team` - Whether it's a home game
- `team_score` - Team's score
- `opponent_score` - Opponent's score
- `notes` - Game notes
- `location` - Game location

### Stats
- `id` - Primary key
- `player_id` - Foreign key to players
- `game_id` - Foreign key to games
- Batting stats: `at_bats`, `hits`, `doubles`, `triples`, `home_runs`, `runs_batted_in`, `runs_scored`, `walks`, `strikeouts`, `stolen_bases`, `hit_by_pitch`, `total_bases`
- Pitching stats: `innings_pitched`, `earned_runs`, `hits_allowed`, `walks_allowed`, `strikeouts_pitched`, `wins`, `losses`, `saves`

### Highlights
- `id` - Primary key
- `player_id` - Foreign key to players
- `title` - Highlight title
- `description` - Highlight description
- `video_url` - YouTube video URL
- `thumbnail_url` - Video thumbnail URL
- `duration_seconds` - Video duration
- `highlight_date` - Date of the highlight

## Usage

### Adding Players
1. Navigate to the Admin panel
2. Click "Manage Players"
3. Fill out player information including name, jersey number, and position

### Recording Games
1. Go to the Admin panel
2. Click "Manage Games"
3. Enter game details including opponent, date, and scores

### Entering Statistics
1. After creating a game, go to "Manage Stats"
2. Enter individual player statistics for that game
3. Statistics will automatically calculate batting averages, ERA, etc.

### Adding Highlights
1. Upload video to YouTube
2. Go to "Manage Highlights" in the Admin panel
3. Enter the YouTube URL and associate with a player
4. The system will automatically generate thumbnails and embed URLs

## Development

### Running Tests
```bash
# Backend tests
bundle exec rspec

# Frontend tests
cd client && npm test
```

### Code Style
- Backend: Follow Ruby style guidelines
- Frontend: Use Prettier for code formatting

## Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `rails db:migrate`
4. Start the Rails server

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve the build folder with a web server
3. Configure API endpoint in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team. 