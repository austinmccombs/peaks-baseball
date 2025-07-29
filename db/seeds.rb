# Sample data for Peaks Baseball Team

puts "Creating sample players..."

# Create sample players
players = [
  {
    first_name: "John",
    last_name: "Smith",
    jersey_number: 1,
    position: "P",
    bio: "Ace pitcher with a fastball that hits 85 mph. Team captain and leader on the mound.",
    height_inches: 72,
    weight_lbs: 160,
    birth_date: Date.new(2010, 3, 15)
  },
  {
    first_name: "Mike",
    last_name: "Johnson",
    jersey_number: 2,
    position: "C",
    bio: "Strong defensive catcher with excellent game calling skills.",
    height_inches: 70,
    weight_lbs: 155,
    birth_date: Date.new(2010, 7, 22)
  },
  {
    first_name: "David",
    last_name: "Williams",
    jersey_number: 3,
    position: "1B",
    bio: "Power hitter with great fielding skills at first base.",
    height_inches: 71,
    weight_lbs: 165,
    birth_date: Date.new(2010, 5, 8)
  },
  {
    first_name: "Chris",
    last_name: "Brown",
    jersey_number: 4,
    position: "2B",
    bio: "Quick infielder with excellent range and solid hitting.",
    height_inches: 69,
    weight_lbs: 150,
    birth_date: Date.new(2010, 9, 12)
  },
  {
    first_name: "Alex",
    last_name: "Davis",
    jersey_number: 5,
    position: "3B",
    bio: "Strong arm at third base with consistent hitting.",
    height_inches: 70,
    weight_lbs: 158,
    birth_date: Date.new(2010, 4, 3)
  }
]

players.each do |player_data|
  Player.create!(player_data)
end

puts "Creating sample games..."

# Create sample games
games = [
  {
    opponent: "Tigers",
    game_date: Date.new(2024, 4, 15),
    season: 2024,
    home_team: true,
    team_score: 8,
    opponent_score: 5,
    location: "Peaks Field"
  },
  {
    opponent: "Eagles",
    game_date: Date.new(2024, 4, 22),
    season: 2024,
    home_team: false,
    team_score: 6,
    opponent_score: 7,
    location: "Eagle Stadium"
  },
  {
    opponent: "Lions",
    game_date: Date.new(2024, 4, 29),
    season: 2024,
    home_team: true,
    team_score: 10,
    opponent_score: 3,
    location: "Peaks Field"
  }
]

games.each do |game_data|
  Game.create!(game_data)
end

puts "Creating sample stats..."

# Create sample stats for the first game
game1 = Game.first
players = Player.all

players.each_with_index do |player, index|
  Stat.create!(
    player: player,
    game: game1,
    at_bats: 3 + index,
    hits: 1 + (index % 2),
    doubles: index % 2,
    triples: 0,
    home_runs: index == 2 ? 1 : 0,
    runs_batted_in: 1 + index,
    runs_scored: index + 1,
    walks: index % 2,
    strikeouts: index % 3,
    stolen_bases: index % 2,
    hit_by_pitch: 0,
    innings_pitched: player.position == "P" ? 5.0 : 0,
    earned_runs: player.position == "P" ? 2 : 0,
    hits_allowed: player.position == "P" ? 4 : 0,
    walks_allowed: player.position == "P" ? 1 : 0,
    strikeouts_pitched: player.position == "P" ? 6 : 0,
    wins: player.position == "P" ? 1 : 0,
    losses: 0,
    saves: 0
  )
end

puts "Creating sample highlights..."

# Create sample highlights
highlights = [
  {
    player: Player.find_by(jersey_number: 1),
    title: "Strikeout to End the Game",
    description: "John Smith strikes out the final batter to secure the win.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    highlight_date: Date.new(2024, 4, 15)
  },
  {
    player: Player.find_by(jersey_number: 3),
    title: "Home Run Over the Fence",
    description: "David Williams hits a towering home run in the 4th inning.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    highlight_date: Date.new(2024, 4, 15)
  },
  {
    player: Player.find_by(jersey_number: 2),
    title: "Perfect Throw to Second",
    description: "Mike Johnson throws out a runner trying to steal second base.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    highlight_date: Date.new(2024, 4, 22)
  }
]

highlights.each do |highlight_data|
  Highlight.create!(highlight_data)
end

puts "Sample data created successfully!"
puts "You can now start the application and see the sample data." 