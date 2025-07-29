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

-- Insert sample players
INSERT INTO players (first_name, last_name, jersey_number, position, bio, height_inches, weight_lbs, birth_date) VALUES
('John', 'Smith', 1, 'P', 'Ace pitcher with a fastball that hits 85 mph. Team captain and leader on the mound.', 72, 160, '2010-03-15'),
('Mike', 'Johnson', 2, 'C', 'Strong defensive catcher with excellent game calling skills.', 70, 155, '2010-07-22'),
('David', 'Williams', 3, '1B', 'Power hitter with great fielding skills at first base.', 71, 165, '2010-05-08'),
('Chris', 'Brown', 4, '2B', 'Quick infielder with excellent range and solid hitting.', 69, 150, '2010-09-12'),
('Alex', 'Davis', 5, '3B', 'Strong arm at third base with consistent hitting.', 70, 158, '2010-04-03');

-- Insert sample games
INSERT INTO games (opponent, game_date, season, home_team, team_score, opponent_score, location) VALUES
('Tigers', '2024-04-15', 2024, true, 8, 5, 'Peaks Field'),
('Eagles', '2024-04-22', 2024, false, 6, 7, 'Eagle Stadium'),
('Lions', '2024-04-29', 2024, true, 10, 3, 'Peaks Field');

-- Insert sample stats for the first game
INSERT INTO stats (player_id, game_id, at_bats, hits, doubles, triples, home_runs, runs_batted_in, runs_scored, walks, strikeouts, stolen_bases, hit_by_pitch, total_bases, innings_pitched, earned_runs, hits_allowed, walks_allowed, strikeouts_pitched, wins, losses, saves) VALUES
(1, 1, 3, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 5.0, 2, 4, 1, 6, 1, 0, 0),
(2, 1, 4, 2, 1, 0, 0, 2, 2, 0, 1, 0, 0, 3, 0.0, 0, 0, 0, 0, 0, 0, 0),
(3, 1, 4, 1, 0, 0, 1, 3, 1, 1, 2, 0, 0, 4, 0.0, 0, 0, 0, 0, 0, 0, 0),
(4, 1, 3, 2, 1, 0, 0, 1, 2, 0, 0, 1, 0, 3, 0.0, 0, 0, 0, 0, 0, 0, 0),
(5, 1, 4, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0.0, 0, 0, 0, 0, 0, 0, 0);

-- Insert sample highlights
INSERT INTO highlights (player_id, title, description, video_url, highlight_date) VALUES
(1, 'Strikeout to End the Game', 'John Smith strikes out the final batter to secure the win.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '2024-04-15'),
(3, 'Home Run Over the Fence', 'David Williams hits a towering home run in the 4th inning.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '2024-04-15'),
(2, 'Perfect Throw to Second', 'Mike Johnson throws out a runner trying to steal second base.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '2024-04-22');

-- Update total_bases for stats
UPDATE stats SET total_bases = 
  CASE 
    WHEN hits > 0 THEN 
      (hits - doubles - triples - home_runs) + (doubles * 2) + (triples * 3) + (home_runs * 4)
    ELSE 0 
  END; 