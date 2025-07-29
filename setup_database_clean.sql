-- Create players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    jersey_number INTEGER NOT NULL UNIQUE,
    position VARCHAR(10) NOT NULL,
    bio TEXT,
    height_inches INTEGER,
    weight_lbs INTEGER,
    birth_date DATE,
    active BOOLEAN DEFAULT true,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    opponent VARCHAR(255) NOT NULL,
    game_date DATE NOT NULL,
    season INTEGER NOT NULL,
    home_team BOOLEAN DEFAULT true,
    team_score INTEGER,
    opponent_score INTEGER,
    notes TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stats table
CREATE TABLE stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id),
    game_id INTEGER NOT NULL REFERENCES games(id),
    at_bats INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    doubles INTEGER DEFAULT 0,
    triples INTEGER DEFAULT 0,
    home_runs INTEGER DEFAULT 0,
    runs_batted_in INTEGER DEFAULT 0,
    runs_scored INTEGER DEFAULT 0,
    walks INTEGER DEFAULT 0,
    strikeouts INTEGER DEFAULT 0,
    stolen_bases INTEGER DEFAULT 0,
    hit_by_pitch INTEGER DEFAULT 0,
    total_bases INTEGER DEFAULT 0,
    innings_pitched DECIMAL(3,1) DEFAULT 0,
    earned_runs INTEGER DEFAULT 0,
    hits_allowed INTEGER DEFAULT 0,
    walks_allowed INTEGER DEFAULT 0,
    strikeouts_pitched INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, game_id)
);

-- Create highlights table
CREATE TABLE highlights (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    duration_seconds INTEGER,
    highlight_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_players_jersey_number ON players(jersey_number);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_active ON players(active);
CREATE INDEX idx_games_game_date ON games(game_date);
CREATE INDEX idx_games_season ON games(season);
CREATE INDEX idx_games_opponent ON games(opponent);
CREATE INDEX idx_stats_player_game ON stats(player_id, game_id);
CREATE INDEX idx_highlights_player_id ON highlights(player_id);
CREATE INDEX idx_highlights_created_at ON highlights(created_at); 