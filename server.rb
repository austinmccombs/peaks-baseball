#!/usr/bin/env ruby

require 'sinatra'
require 'sinatra/cross_origin'
require 'json'
require 'pg'
require 'bcrypt'

puts "=== Starting Peaks Baseball API ==="
puts "Ruby version: #{RUBY_VERSION}"
puts "Port: #{ENV['PORT'] || 10000}"
puts "Environment: #{ENV['RACK_ENV'] || 'development'}"

# Configure Sinatra to run on port from environment or default to 10000
port = ENV['PORT'] || 10000
set :port, port
set :bind, '0.0.0.0'

# Serve static files from the client build directory
set :public_folder, File.join(File.dirname(__FILE__), 'client', 'build')

# Enable CORS
configure do
  enable :cross_origin
end

before do
  response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
  response.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
  response.headers["Access-Control-Allow-Origin"] = "*"
end

options "*" do
  response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
  response.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
  response.headers["Access-Control-Allow-Origin"] = "*"
  200
end

# Serve React app for all non-API routes
get '/*' do
  # Don't serve React app for API routes
  pass if request.path_info.start_with?('/api/')
  
  # Serve index.html for all other routes (React Router)
  send_file File.join(settings.public_folder, 'index.html')
end

# Database connection
def db_connection
  @db_connection ||= begin
    if ENV['DATABASE_URL']
      # Production database connection
      PG.connect(ENV['DATABASE_URL'])
    else
      # Development database connection
      PG.connect(dbname: 'peaks_baseball_development')
    end
  end
end

# Initialize admin users table if it doesn't exist
def init_admin_users_table
  begin
    db_connection.exec("
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    ")
    puts "Admin users table initialized"
  rescue => e
    puts "Error initializing admin users table: #{e.message}"
  end
end

# Initialize the admin users table on startup
init_admin_users_table

# Initialize main database tables if they don't exist
def init_main_tables
  begin
    # Check if players table exists
    result = db_connection.exec("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'players')")
    if result.first['exists'] == 'f'
      puts "Setting up main database tables..."
      
      # Read and execute the setup SQL (use clean version for production)
      sql_file = ENV['RACK_ENV'] == 'production' ? 'setup_database_clean.sql' : 'setup_database.sql'
      sql_content = File.read(sql_file)
      db_connection.exec(sql_content)
      
      puts "✅ Main database tables created successfully!"
    else
      puts "Main database tables already exist"
    end
  rescue => e
    puts "Error initializing main tables: #{e.message}"
  end
end

# Initialize main tables on startup
init_main_tables

# Admin authentication helper
def authenticate_admin(username, password)
  begin
    result = db_connection.exec("SELECT password_hash FROM admin_users WHERE username = $1", [username])
    return false if result.ntuples == 0
    
    stored_hash = result.first['password_hash']
    BCrypt::Password.new(stored_hash) == password
  rescue => e
    puts "Authentication error: #{e.message}"
    false
  end
end

# Check if any admin users exist
def admin_users_exist?
  begin
    result = db_connection.exec("SELECT COUNT(*) as count FROM admin_users")
    result.first['count'].to_i > 0
  rescue => e
    puts "Error checking admin users: #{e.message}"
    false
  end
end

# Auto-create admin user if none exist (for production deployment)
def create_default_admin
  begin
    # Only create if no admin users exist
    if !admin_users_exist?
      username = ENV['ADMIN_USERNAME'] || 'upeaksbaseball'
      password = ENV['ADMIN_PASSWORD'] || '02Bud00!@!@'
      email = ENV['ADMIN_EMAIL']
      
      puts "Creating default admin user: #{username}"
      password_hash = BCrypt::Password.create(password)
      
      result = db_connection.exec("
        INSERT INTO admin_users (username, password_hash, email, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id, username, email, created_at
      ", [username, password_hash, email])
      
      admin_user = result.first
      puts "✅ Default admin user created successfully!"
      puts "   ID: #{admin_user['id']}"
      puts "   Username: #{admin_user['username']}"
      puts "   Email: #{admin_user['email'] || 'Not provided'}"
      puts "   You can now log in at /admin/login"
    else
      puts "Admin users already exist, skipping default admin creation"
    end
  rescue => e
    puts "Error creating default admin user: #{e.message}"
  end
end

# Create default admin user on startup
create_default_admin

# Admin user creation endpoint (only works if no admin users exist)
post '/api/v1/admin/setup' do
  content_type :json
  
  # Only allow setup if no admin users exist
  if admin_users_exist?
    status 403
    return { error: 'Admin setup is disabled. Admin users already exist.' }.to_json
  end
  
  begin
    data = JSON.parse(request.body.read)
    username = data['username']
    password = data['password']
    email = data['email']
    
    # Validate input
    if username.nil? || password.nil? || username.strip.empty? || password.strip.empty?
      status 400
      return { error: 'Username and password are required' }.to_json
    end
    
    if password.length < 8
      status 400
      return { error: 'Password must be at least 8 characters long' }.to_json
    end
    
    # Hash the password
    password_hash = BCrypt::Password.create(password)
    
    # Create the admin user
    result = db_connection.exec("
      INSERT INTO admin_users (username, password_hash, email, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, username, email, created_at
    ", [username.strip, password_hash, email&.strip])
    
    admin_user = result.first
    {
      id: admin_user['id'].to_i,
      username: admin_user['username'],
      email: admin_user['email'],
      created_at: admin_user['created_at'],
      message: 'Admin user created successfully'
    }.to_json
    
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Admin login endpoint
post '/api/v1/admin/login' do
  content_type :json
  
  begin
    data = JSON.parse(request.body.read)
    username = data['username']
    password = data['password']
    
    if authenticate_admin(username, password)
      {
        success: true,
        message: 'Login successful',
        username: username
      }.to_json
    else
      status 401
      { error: 'Invalid credentials' }.to_json
    end
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Check if admin setup is needed
get '/api/v1/admin/setup-status' do
  content_type :json
  
  {
    setup_needed: !admin_users_exist?,
    message: admin_users_exist? ? 'Admin users exist' : 'No admin users found. Setup required.'
  }.to_json
end

# Players API
get '/api/v1/players' do
  content_type :json
  result = db_connection.exec("SELECT * FROM players WHERE active = true ORDER BY jersey_number")
  players = result.map do |row|
    {
      id: row['id'].to_i,
      first_name: row['first_name'],
      last_name: row['last_name'],
      full_name: "#{row['first_name']} #{row['last_name']}",
      display_name: "#{row['jersey_number']}. #{row['first_name']} #{row['last_name']}",
      jersey_number: row['jersey_number'].to_i,
      position: row['position'],
      bio: row['bio'],
      height_inches: row['height_inches']&.to_i,
      weight_lbs: row['weight_lbs']&.to_i,
      birth_date: row['birth_date'],
      active: row['active'] == 't',
      photo_url: row['photo_url'],
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  players.to_json
end

# Admin endpoint to get all players (including deactivated)
get '/api/v1/admin/players' do
  content_type :json
  result = db_connection.exec("SELECT * FROM players ORDER BY jersey_number")
  players = result.map do |row|
    {
      id: row['id'].to_i,
      first_name: row['first_name'],
      last_name: row['last_name'],
      full_name: "#{row['first_name']} #{row['last_name']}",
      display_name: "#{row['jersey_number']}. #{row['first_name']} #{row['last_name']}",
      jersey_number: row['jersey_number'].to_i,
      position: row['position'],
      bio: row['bio'],
      height_inches: row['height_inches']&.to_i,
      weight_lbs: row['weight_lbs']&.to_i,
      birth_date: row['birth_date'],
      active: row['active'] == 't',
      photo_url: row['photo_url'],
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  players.to_json
end

post '/api/v1/players' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  # Validate required fields
  unless data['first_name'] && data['first_name'].strip != ''
    status 422
    return { error: 'First name is required' }.to_json
  end
  
  unless data['last_name'] && data['last_name'].strip != ''
    status 422
    return { error: 'Last name is required' }.to_json
  end
  
  unless data['jersey_number'] && data['jersey_number'].to_s.strip != ''
    status 422
    return { error: 'Jersey number is required' }.to_json
  end
  
  begin
    # Handle empty date strings properly
    birth_date = data['birth_date']
    birth_date = nil if birth_date.nil? || birth_date.to_s.strip == ''
    
    result = db_connection.exec("
      INSERT INTO players (first_name, last_name, jersey_number, position, bio, height_inches, weight_lbs, birth_date, photo_url, active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    ", [
      data['first_name'].strip,
      data['last_name'].strip,
      data['jersey_number'].to_i,
      data['position'] || '',
      data['bio'] || '',
      data['height_inches']&.to_i || nil,
      data['weight_lbs']&.to_i || nil,
      birth_date,
      data['photo_url'] || '',
      true
    ])
    
    player = result.first
    {
      id: player['id'].to_i,
      first_name: player['first_name'],
      last_name: player['last_name'],
      full_name: "#{player['first_name']} #{player['last_name']}",
      display_name: "#{player['jersey_number']}. #{player['first_name']} #{player['last_name']}",
      jersey_number: player['jersey_number'].to_i,
      position: player['position'],
      bio: player['bio'],
      height_inches: player['height_inches']&.to_i,
      weight_lbs: player['weight_lbs']&.to_i,
      birth_date: player['birth_date'],
      active: player['active'] == 't',
      photo_url: player['photo_url'],
      created_at: player['created_at'],
      updated_at: player['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

put '/api/v1/players/:id' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    # Only update active field if it's explicitly provided
    active_value = data.key?('active') ? data['active'] : nil
    
    # Handle empty date strings properly
    birth_date = data['birth_date']
    birth_date = nil if birth_date.nil? || birth_date.to_s.strip == ''
    
    if active_value.nil?
      # Don't update active field
      result = db_connection.exec("
        UPDATE players 
        SET first_name = $1, last_name = $2, jersey_number = $3, position = $4, bio = $5, 
            height_inches = $6, weight_lbs = $7, birth_date = $8, photo_url = $9, updated_at = NOW()
        WHERE id = $10
        RETURNING *
      ", [
        data['first_name']&.strip || '',
        data['last_name']&.strip || '',
        data['jersey_number']&.to_i || 0,
        data['position'] || '',
        data['bio'] || '',
        data['height_inches']&.to_i || nil,
        data['weight_lbs']&.to_i || nil,
        birth_date,
        data['photo_url'] || '',
        params[:id]
      ])
    else
      # Update active field
      result = db_connection.exec("
        UPDATE players 
        SET first_name = $1, last_name = $2, jersey_number = $3, position = $4, bio = $5, 
            height_inches = $6, weight_lbs = $7, birth_date = $8, photo_url = $9, active = $10, updated_at = NOW()
        WHERE id = $11
        RETURNING *
      ", [
        data['first_name']&.strip || '',
        data['last_name']&.strip || '',
        data['jersey_number']&.to_i || 0,
        data['position'] || '',
        data['bio'] || '',
        data['height_inches']&.to_i || nil,
        data['weight_lbs']&.to_i || nil,
        birth_date,
        data['photo_url'] || '',
        active_value,
        params[:id]
      ])
    end
    
    return { error: 'Player not found' }.to_json, 404 if result.ntuples == 0
    
    player = result.first
    {
      id: player['id'].to_i,
      first_name: player['first_name'],
      last_name: player['last_name'],
      full_name: "#{player['first_name']} #{player['last_name']}",
      display_name: "#{player['jersey_number']}. #{player['first_name']} #{player['last_name']}",
      jersey_number: player['jersey_number'].to_i,
      position: player['position'],
      bio: player['bio'],
      height_inches: player['height_inches']&.to_i,
      weight_lbs: player['weight_lbs']&.to_i,
      birth_date: player['birth_date'],
      active: player['active'] == 't',
      photo_url: player['photo_url'],
      created_at: player['created_at'],
      updated_at: player['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

delete '/api/v1/players/:id' do
  content_type :json
  
  begin
    result = db_connection.exec("
      UPDATE players SET active = false, updated_at = NOW() WHERE id = $1
    ", [params[:id]])
    
    { message: 'Player deactivated successfully' }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Reactivate player endpoint
put '/api/v1/players/:id/reactivate' do
  content_type :json
  
  begin
    result = db_connection.exec("
      UPDATE players SET active = true, updated_at = NOW() WHERE id = $1
    ", [params[:id]])
    
    { message: 'Player reactivated successfully' }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end



# Games API
get '/api/v1/games' do
  content_type :json
  result = db_connection.exec("SELECT * FROM games ORDER BY game_date DESC")
  games = result.map do |row|
    {
      id: row['id'].to_i,
      opponent: row['opponent'],
      game_date: row['game_date'],
      season: row['season'].to_i,
      home_team: row['home_team'] == 't',
      team_score: row['team_score']&.to_i,
      opponent_score: row['opponent_score']&.to_i,
      notes: row['notes'],
      location: row['location'],
      formatted_date: Date.parse(row['game_date']).strftime('%B %d, %Y'),
      short_date: Date.parse(row['game_date']).strftime('%m/%d/%y'),
      score_display: row['home_team'] == 't' ? "#{row['team_score']} - #{row['opponent_score']}" : "#{row['opponent_score']} - #{row['team_score']}",
      game_result: (row['team_score'].to_i > row['opponent_score'].to_i) ? 'W' : (row['team_score'].to_i < row['opponent_score'].to_i) ? 'L' : 'T',
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  games.to_json
end

post '/api/v1/games' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    result = db_connection.exec("
      INSERT INTO games (opponent, game_date, season, home_team, team_score, opponent_score, notes, location, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    ", [
      data['opponent'],
      data['game_date'],
      data['season'],
      data['home_team'],
      data['team_score'] || nil,
      data['opponent_score'] || nil,
      data['notes'] || '',
      data['location'] || ''
    ])
    
    game = result.first
    {
      id: game['id'].to_i,
      opponent: game['opponent'],
      game_date: game['game_date'],
      season: game['season'].to_i,
      home_team: game['home_team'] == 't',
      team_score: game['team_score']&.to_i,
      opponent_score: game['opponent_score']&.to_i,
      notes: game['notes'],
      location: game['location'],
      formatted_date: Date.parse(game['game_date']).strftime('%B %d, %Y'),
      short_date: Date.parse(game['game_date']).strftime('%m/%d/%y'),
      score_display: game['home_team'] == 't' ? "#{game['team_score']} - #{game['opponent_score']}" : "#{game['opponent_score']} - #{game['team_score']}",
      game_result: (game['team_score'].to_i > game['opponent_score'].to_i) ? 'W' : (game['team_score'].to_i < game['opponent_score'].to_i) ? 'L' : 'T',
      created_at: game['created_at'],
      updated_at: game['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

put '/api/v1/games/:id' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    result = db_connection.exec("
      UPDATE games 
      SET opponent = $1, game_date = $2, season = $3, home_team = $4, team_score = $5, 
          opponent_score = $6, notes = $7, location = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    ", [
      data['opponent'],
      data['game_date'],
      data['season'],
      data['home_team'],
      data['team_score'] || nil,
      data['opponent_score'] || nil,
      data['notes'] || '',
      data['location'] || '',
      params[:id]
    ])
    
    return { error: 'Game not found' }.to_json, 404 if result.ntuples == 0
    
    game = result.first
    {
      id: game['id'].to_i,
      opponent: game['opponent'],
      game_date: game['game_date'],
      season: game['season'].to_i,
      home_team: game['home_team'] == 't',
      team_score: game['team_score']&.to_i,
      opponent_score: game['opponent_score']&.to_i,
      notes: game['notes'],
      location: game['location'],
      formatted_date: Date.parse(game['game_date']).strftime('%B %d, %Y'),
      short_date: Date.parse(game['game_date']).strftime('%m/%d/%y'),
      score_display: game['home_team'] == 't' ? "#{game['team_score']} - #{game['opponent_score']}" : "#{game['opponent_score']} - #{game['team_score']}",
      game_result: (game['team_score'].to_i > game['opponent_score'].to_i) ? 'W' : (game['team_score'].to_i < game['opponent_score'].to_i) ? 'L' : 'T',
      created_at: game['created_at'],
      updated_at: game['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

delete '/api/v1/games/:id' do
  content_type :json
  
  begin
    db_connection.exec("DELETE FROM games WHERE id = $1", [params[:id]])
    { message: 'Game deleted successfully' }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Game Detail API
get '/api/v1/games/:id' do
  content_type :json
  
  begin
    result = db_connection.exec("SELECT * FROM games WHERE id = $1", [params[:id]])
    
    return { error: 'Game not found' }.to_json, 404 if result.ntuples == 0
    
    game = result.first
    {
      id: game['id'].to_i,
      opponent: game['opponent'],
      game_date: game['game_date'],
      season: game['season'].to_i,
      home_team: game['home_team'] == 't',
      team_score: game['team_score']&.to_i,
      opponent_score: game['opponent_score']&.to_i,
      notes: game['notes'],
      location: game['location'],
      formatted_date: Date.parse(game['game_date']).strftime('%B %d, %Y'),
      short_date: Date.parse(game['game_date']).strftime('%m/%d/%y'),
      score_display: game['home_team'] == 't' ? "#{game['team_score']} - #{game['opponent_score']}" : "#{game['opponent_score']} - #{game['team_score']}",
      game_result: (game['team_score'].to_i > game['opponent_score'].to_i) ? 'W' : (game['team_score'].to_i < game['opponent_score'].to_i) ? 'L' : 'T',
      created_at: game['created_at'],
      updated_at: game['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Stats API
get '/api/v1/stats' do
  content_type :json
  result = db_connection.exec("
    SELECT s.*, p.first_name, p.last_name, g.opponent, g.game_date 
    FROM stats s 
    JOIN players p ON s.player_id = p.id 
    JOIN games g ON s.game_id = g.id 
    ORDER BY g.game_date DESC
  ")
  stats = result.map do |row|
    {
      id: row['id'].to_i,
      player_id: row['player_id'].to_i,
      game_id: row['game_id'].to_i,
      at_bats: row['at_bats'].to_i,
      hits: row['hits'].to_i,
      doubles: row['doubles'].to_i,
      triples: row['triples'].to_i,
      home_runs: row['home_runs'].to_i,
      runs_batted_in: row['runs_batted_in'].to_i,
      runs_scored: row['runs_scored'].to_i,
      walks: row['walks'].to_i,
      strikeouts: row['strikeouts'].to_i,
      stolen_bases: row['stolen_bases'].to_i,
      hit_by_pitch: row['hit_by_pitch'].to_i,
      total_bases: row['total_bases'].to_i,
      innings_pitched: row['innings_pitched'].to_f,
      earned_runs: row['earned_runs'].to_i,
      hits_allowed: row['hits_allowed'].to_i,
      walks_allowed: row['walks_allowed'].to_i,
      strikeouts_pitched: row['strikeouts_pitched'].to_i,
      wins: row['wins'].to_i,
      losses: row['losses'].to_i,
      saves: row['saves'].to_i,
      batting_average: row['at_bats'].to_i > 0 ? (row['hits'].to_f / row['at_bats'].to_i).round(3) : 0.0,
      on_base_percentage: (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i) > 0 ? ((row['hits'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i).to_f / (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i)).round(3) : 0.0,
      slugging_percentage: row['at_bats'].to_i > 0 ? (row['total_bases'].to_f / row['at_bats'].to_i).round(3) : 0.0,
      era: row['innings_pitched'].to_f > 0 ? ((row['earned_runs'].to_i * 9.0) / row['innings_pitched'].to_f).round(2) : 0.0,
      whip: row['innings_pitched'].to_f > 0 ? ((row['walks_allowed'].to_i + row['hits_allowed'].to_i) / row['innings_pitched'].to_f).round(2) : 0.0,
      player: {
        id: row['player_id'].to_i,
        first_name: row['first_name'],
        last_name: row['last_name'],
        full_name: "#{row['first_name']} #{row['last_name']}"
      },
      game: {
        id: row['game_id'].to_i,
        opponent: row['opponent'],
        game_date: row['game_date'],
        short_date: Date.parse(row['game_date']).strftime('%m/%d/%y')
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  stats.to_json
end

post '/api/v1/stats' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    # Calculate total bases
    total_bases = (data['hits'].to_i - data['doubles'].to_i - data['triples'].to_i - data['home_runs'].to_i) + 
                  (data['doubles'].to_i * 2) + (data['triples'].to_i * 3) + (data['home_runs'].to_i * 4)
    
    result = db_connection.exec("
      INSERT INTO stats (player_id, game_id, at_bats, hits, doubles, triples, home_runs, runs_batted_in, 
                        runs_scored, walks, strikeouts, stolen_bases, hit_by_pitch, total_bases,
                        innings_pitched, earned_runs, hits_allowed, walks_allowed, strikeouts_pitched, 
                        wins, losses, saves, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW(), NOW())
      RETURNING *
    ", [
      data['player_id'],
      data['game_id'],
      data['at_bats'] || 0,
      data['hits'] || 0,
      data['doubles'] || 0,
      data['triples'] || 0,
      data['home_runs'] || 0,
      data['runs_batted_in'] || 0,
      data['runs_scored'] || 0,
      data['walks'] || 0,
      data['strikeouts'] || 0,
      data['stolen_bases'] || 0,
      data['hit_by_pitch'] || 0,
      total_bases,
      data['innings_pitched'] || 0.0,
      data['earned_runs'] || 0,
      data['hits_allowed'] || 0,
      data['walks_allowed'] || 0,
      data['strikeouts_pitched'] || 0,
      data['wins'] || 0,
      data['losses'] || 0,
      data['saves'] || 0
    ])
    
    stat = result.first
    {
      id: stat['id'].to_i,
      player_id: stat['player_id'].to_i,
      game_id: stat['game_id'].to_i,
      at_bats: stat['at_bats'].to_i,
      hits: stat['hits'].to_i,
      doubles: stat['doubles'].to_i,
      triples: stat['triples'].to_i,
      home_runs: stat['home_runs'].to_i,
      runs_batted_in: stat['runs_batted_in'].to_i,
      runs_scored: stat['runs_scored'].to_i,
      walks: stat['walks'].to_i,
      strikeouts: stat['strikeouts'].to_i,
      stolen_bases: stat['stolen_bases'].to_i,
      hit_by_pitch: stat['hit_by_pitch'].to_i,
      total_bases: stat['total_bases'].to_i,
      innings_pitched: stat['innings_pitched'].to_f,
      earned_runs: stat['earned_runs'].to_i,
      hits_allowed: stat['hits_allowed'].to_i,
      walks_allowed: stat['walks_allowed'].to_i,
      strikeouts_pitched: stat['strikeouts_pitched'].to_i,
      wins: stat['wins'].to_i,
      losses: stat['losses'].to_i,
      saves: stat['saves'].to_i,
      created_at: stat['created_at'],
      updated_at: stat['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

put '/api/v1/stats/:id' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    # Calculate total bases
    total_bases = (data['hits'].to_i - data['doubles'].to_i - data['triples'].to_i - data['home_runs'].to_i) + 
                  (data['doubles'].to_i * 2) + (data['triples'].to_i * 3) + (data['home_runs'].to_i * 4)
    
    result = db_connection.exec("
      UPDATE stats 
      SET player_id = $1, game_id = $2, at_bats = $3, hits = $4, doubles = $5, triples = $6, 
          home_runs = $7, runs_batted_in = $8, runs_scored = $9, walks = $10, strikeouts = $11, 
          stolen_bases = $12, hit_by_pitch = $13, total_bases = $14, innings_pitched = $15, 
          earned_runs = $16, hits_allowed = $17, walks_allowed = $18, strikeouts_pitched = $19, 
          wins = $20, losses = $21, saves = $22, updated_at = NOW()
      WHERE id = $23
      RETURNING *
    ", [
      data['player_id'],
      data['game_id'],
      data['at_bats'] || 0,
      data['hits'] || 0,
      data['doubles'] || 0,
      data['triples'] || 0,
      data['home_runs'] || 0,
      data['runs_batted_in'] || 0,
      data['runs_scored'] || 0,
      data['walks'] || 0,
      data['strikeouts'] || 0,
      data['stolen_bases'] || 0,
      data['hit_by_pitch'] || 0,
      total_bases,
      data['innings_pitched'] || 0.0,
      data['earned_runs'] || 0,
      data['hits_allowed'] || 0,
      data['walks_allowed'] || 0,
      data['strikeouts_pitched'] || 0,
      data['wins'] || 0,
      data['losses'] || 0,
      data['saves'] || 0,
      params[:id]
    ])
    
    return { error: 'Stat not found' }.to_json, 404 if result.ntuples == 0
    
    stat = result.first
    {
      id: stat['id'].to_i,
      player_id: stat['player_id'].to_i,
      game_id: stat['game_id'].to_i,
      at_bats: stat['at_bats'].to_i,
      hits: stat['hits'].to_i,
      doubles: stat['doubles'].to_i,
      triples: stat['triples'].to_i,
      home_runs: stat['home_runs'].to_i,
      runs_batted_in: stat['runs_batted_in'].to_i,
      runs_scored: stat['runs_scored'].to_i,
      walks: stat['walks'].to_i,
      strikeouts: stat['strikeouts'].to_i,
      stolen_bases: stat['stolen_bases'].to_i,
      hit_by_pitch: stat['hit_by_pitch'].to_i,
      total_bases: stat['total_bases'].to_i,
      innings_pitched: stat['innings_pitched'].to_f,
      earned_runs: stat['earned_runs'].to_i,
      hits_allowed: stat['hits_allowed'].to_i,
      walks_allowed: stat['walks_allowed'].to_i,
      strikeouts_pitched: stat['strikeouts_pitched'].to_i,
      wins: stat['wins'].to_i,
      losses: stat['losses'].to_i,
      saves: stat['saves'].to_i,
      created_at: stat['created_at'],
      updated_at: stat['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

delete '/api/v1/stats/:id' do
  content_type :json
  
  begin
    db_connection.exec("DELETE FROM stats WHERE id = $1", [params[:id]])
    { message: 'Stat deleted successfully' }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Highlights API
get '/api/v1/highlights' do
  content_type :json
  result = db_connection.exec("
    SELECT h.*, p.first_name, p.last_name 
    FROM highlights h 
    JOIN players p ON h.player_id = p.id 
    ORDER BY h.created_at DESC
  ")
  highlights = result.map do |row|
    video_url = row['video_url']
    video_id = if video_url.include?('youtube.com/watch')
      video_url.split('v=').last.split('&').first
    elsif video_url.include?('youtu.be/')
      video_url.split('youtu.be/').last
    else
      nil
    end
    
    {
      id: row['id'].to_i,
      player_id: row['player_id'].to_i,
      title: row['title'],
      description: row['description'],
      video_url: video_url,
      video_embed_url: video_id ? "https://www.youtube.com/embed/#{video_id}" : video_url,
      thumbnail_url: video_id ? "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg" : nil,
      duration_seconds: row['duration_seconds']&.to_i,
      highlight_date: row['highlight_date'],
      formatted_date: Date.parse(row['created_at']).strftime('%B %d, %Y'),
      player: {
        id: row['player_id'].to_i,
        first_name: row['first_name'],
        last_name: row['last_name'],
        full_name: "#{row['first_name']} #{row['last_name']}"
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  highlights.to_json
end

post '/api/v1/highlights' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    result = db_connection.exec("
      INSERT INTO highlights (player_id, title, description, video_url, thumbnail_url, duration_seconds, highlight_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    ", [
      data['player_id'],
      data['title'],
      data['description'] || '',
      data['video_url'],
      data['thumbnail_url'] || '',
      data['duration_seconds'] || nil,
      data['highlight_date']
    ])
    
    highlight = result.first
    video_url = highlight['video_url']
    video_id = if video_url.include?('youtube.com/watch')
      video_url.split('v=').last.split('&').first
    elsif video_url.include?('youtu.be/')
      video_url.split('youtu.be/').last
    else
      nil
    end
    
    {
      id: highlight['id'].to_i,
      player_id: highlight['player_id'].to_i,
      title: highlight['title'],
      description: highlight['description'],
      video_url: video_url,
      video_embed_url: video_id ? "https://www.youtube.com/embed/#{video_id}" : video_url,
      thumbnail_url: video_id ? "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg" : nil,
      duration_seconds: highlight['duration_seconds']&.to_i,
      highlight_date: highlight['highlight_date'],
      formatted_date: Date.parse(highlight['created_at']).strftime('%B %d, %Y'),
      created_at: highlight['created_at'],
      updated_at: highlight['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

put '/api/v1/highlights/:id' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  begin
    result = db_connection.exec("
      UPDATE highlights 
      SET player_id = $1, title = $2, description = $3, video_url = $4, thumbnail_url = $5, 
          duration_seconds = $6, highlight_date = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    ", [
      data['player_id'],
      data['title'],
      data['description'] || '',
      data['video_url'],
      data['thumbnail_url'] || '',
      data['duration_seconds'] || nil,
      data['highlight_date'],
      params[:id]
    ])
    
    return { error: 'Highlight not found' }.to_json, 404 if result.ntuples == 0
    
    highlight = result.first
    video_url = highlight['video_url']
    video_id = if video_url.include?('youtube.com/watch')
      video_url.split('v=').last.split('&').first
    elsif video_url.include?('youtu.be/')
      video_url.split('youtu.be/').last
    else
      nil
    end
    
    {
      id: highlight['id'].to_i,
      player_id: highlight['player_id'].to_i,
      title: highlight['title'],
      description: highlight['description'],
      video_url: video_url,
      video_embed_url: video_id ? "https://www.youtube.com/embed/#{video_id}" : video_url,
      thumbnail_url: video_id ? "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg" : nil,
      duration_seconds: highlight['duration_seconds']&.to_i,
      highlight_date: highlight['highlight_date'],
      formatted_date: Date.parse(highlight['created_at']).strftime('%B %d, %Y'),
      created_at: highlight['created_at'],
      updated_at: highlight['updated_at']
    }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

delete '/api/v1/highlights/:id' do
  content_type :json
  
  begin
    db_connection.exec("DELETE FROM highlights WHERE id = $1", [params[:id]])
    { message: 'Highlight deleted successfully' }.to_json
  rescue => e
    status 422
    { error: e.message }.to_json
  end
end

# Roster stats endpoint
get '/api/v1/roster/stats' do
  content_type :json
  result = db_connection.exec("
    SELECT p.*, 
           COUNT(s.id) as games_played,
           SUM(s.at_bats) as total_at_bats,
           SUM(s.hits) as total_hits,
           SUM(s.doubles) as total_doubles,
           SUM(s.triples) as total_triples,
           SUM(s.home_runs) as total_home_runs,
           SUM(s.runs_batted_in) as total_rbi,
           SUM(s.runs_scored) as total_runs,
           SUM(s.walks) as total_walks,
           SUM(s.strikeouts) as total_strikeouts,
           SUM(s.stolen_bases) as total_stolen_bases,
           SUM(s.hit_by_pitch) as total_hbp,
           SUM(s.total_bases) as total_bases,
           SUM(s.innings_pitched) as total_innings,
           SUM(s.earned_runs) as total_earned_runs,
           SUM(s.hits_allowed) as total_hits_allowed,
           SUM(s.walks_allowed) as total_walks_allowed,
           SUM(s.strikeouts_pitched) as total_strikeouts_pitched,
           SUM(s.wins) as total_wins,
           SUM(s.losses) as total_losses,
           SUM(s.saves) as total_saves
    FROM players p
    LEFT JOIN stats s ON p.id = s.player_id
    WHERE p.active = true
    GROUP BY p.id
    ORDER BY p.jersey_number
  ")
  
  players = result.map do |row|
    games_played = row['games_played'].to_i
    total_at_bats = row['total_at_bats'].to_i
    total_hits = row['total_hits'].to_i
    
    batting_average = total_at_bats > 0 ? (total_hits.to_f / total_at_bats).round(3) : 0.0
    on_base_percentage = (total_at_bats + row['total_walks'].to_i + row['total_hbp'].to_i) > 0 ? 
      ((total_hits + row['total_walks'].to_i + row['total_hbp'].to_i).to_f / (total_at_bats + row['total_walks'].to_i + row['total_hbp'].to_i)).round(3) : 0.0
    slugging_percentage = total_at_bats > 0 ? (row['total_bases'].to_f / total_at_bats).round(3) : 0.0
    era = row['total_innings'].to_f > 0 ? ((row['total_earned_runs'].to_i * 9.0) / row['total_innings'].to_f).round(2) : 0.0
    whip = row['total_innings'].to_f > 0 ? ((row['total_walks_allowed'].to_i + row['total_hits_allowed'].to_i) / row['total_innings'].to_f).round(2) : 0.0
    
    {
      id: row['id'].to_i,
      first_name: row['first_name'],
      last_name: row['last_name'],
      full_name: "#{row['first_name']} #{row['last_name']}",
      display_name: "#{row['jersey_number']}. #{row['first_name']} #{row['last_name']}",
      jersey_number: row['jersey_number'].to_i,
      position: row['position'],
      bio: row['bio'],
      height_inches: row['height_inches']&.to_i,
      weight_lbs: row['weight_lbs']&.to_i,
      birth_date: row['birth_date'],
      active: row['active'] == 't',
      photo_url: row['photo_url'],
      season_stats: {
        games_played: games_played,
        at_bats: total_at_bats,
        hits: total_hits,
        doubles: row['total_doubles'].to_i,
        triples: row['total_triples'].to_i,
        home_runs: row['total_home_runs'].to_i,
        runs_batted_in: row['total_rbi'].to_i,
        runs_scored: row['total_runs'].to_i,
        walks: row['total_walks'].to_i,
        strikeouts: row['total_strikeouts'].to_i,
        stolen_bases: row['total_stolen_bases'].to_i,
        hit_by_pitch: row['total_hbp'].to_i,
        total_bases: row['total_bases'].to_i,
        batting_average: batting_average,
        on_base_percentage: on_base_percentage,
        slugging_percentage: slugging_percentage,
        ops: (on_base_percentage + slugging_percentage).round(3),
        innings_pitched: row['total_innings'].to_f,
        earned_runs: row['total_earned_runs'].to_i,
        hits_allowed: row['total_hits_allowed'].to_i,
        walks_allowed: row['total_walks_allowed'].to_i,
        strikeouts_pitched: row['total_strikeouts_pitched'].to_i,
        wins: row['total_wins'].to_i,
        losses: row['total_losses'].to_i,
        saves: row['total_saves'].to_i,
        era: era,
        whip: whip
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  players.to_json
end

# Individual player highlights
get '/api/v1/players/:id/highlights' do
  content_type :json
  result = db_connection.exec("
    SELECT h.*, p.first_name, p.last_name 
    FROM highlights h 
    JOIN players p ON h.player_id = p.id 
    WHERE h.player_id = $1
    ORDER BY h.created_at DESC
  ", [params[:id]])
  
  highlights = result.map do |row|
    video_url = row['video_url']
    video_id = if video_url.include?('youtube.com/watch')
      video_url.split('v=').last.split('&').first
    elsif video_url.include?('youtu.be/')
      video_url.split('youtu.be/').last
    else
      nil
    end
    
    {
      id: row['id'].to_i,
      player_id: row['player_id'].to_i,
      title: row['title'],
      description: row['description'],
      video_url: video_url,
      video_embed_url: video_id ? "https://www.youtube.com/embed/#{video_id}" : video_url,
      thumbnail_url: video_id ? "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg" : nil,
      duration_seconds: row['duration_seconds']&.to_i,
      highlight_date: row['highlight_date'],
      formatted_date: Date.parse(row['created_at']).strftime('%B %d, %Y'),
      player: {
        id: row['player_id'].to_i,
        first_name: row['first_name'],
        last_name: row['last_name'],
        full_name: "#{row['first_name']} #{row['last_name']}"
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  highlights.to_json
end

# Individual player stats (season totals)
get '/api/v1/players/:id/stats' do
  content_type :json
  result = db_connection.exec("
    SELECT 
      COUNT(s.id) as games_played,
      SUM(s.at_bats) as total_at_bats,
      SUM(s.hits) as total_hits,
      SUM(s.doubles) as total_doubles,
      SUM(s.triples) as total_triples,
      SUM(s.home_runs) as total_home_runs,
      SUM(s.runs_batted_in) as total_rbi,
      SUM(s.runs_scored) as total_runs,
      SUM(s.walks) as total_walks,
      SUM(s.strikeouts) as total_strikeouts,
      SUM(s.stolen_bases) as total_stolen_bases,
      SUM(s.hit_by_pitch) as total_hbp,
      SUM(s.total_bases) as total_bases,
      SUM(s.innings_pitched) as total_innings,
      SUM(s.earned_runs) as total_earned_runs,
      SUM(s.hits_allowed) as total_hits_allowed,
      SUM(s.walks_allowed) as total_walks_allowed,
      SUM(s.strikeouts_pitched) as total_strikeouts_pitched,
      SUM(s.wins) as total_wins,
      SUM(s.losses) as total_losses,
      SUM(s.saves) as total_saves
    FROM players p
    LEFT JOIN stats s ON p.id = s.player_id
    WHERE p.id = $1
  ", [params[:id]])
  
  return { error: 'Player not found' }.to_json, 404 if result.ntuples == 0
  
  row = result.first
  games_played = row['games_played'].to_i
  total_at_bats = row['total_at_bats'].to_i
  total_hits = row['total_hits'].to_i
  
  batting_average = total_at_bats > 0 ? (total_hits.to_f / total_at_bats).round(3) : 0.0
  on_base_percentage = (total_at_bats + row['total_walks'].to_i + row['total_hbp'].to_i) > 0 ? 
    ((total_hits + row['total_walks'].to_i + row['total_hbp'].to_i).to_f / (total_at_bats + row['total_walks'].to_i + row['total_hbp'].to_i)).round(3) : 0.0
  slugging_percentage = total_at_bats > 0 ? (row['total_bases'].to_f / total_at_bats).round(3) : 0.0
  era = row['total_innings'].to_f > 0 ? ((row['total_earned_runs'].to_i * 9.0) / row['total_innings'].to_f).round(2) : 0.0
  whip = row['total_innings'].to_f > 0 ? ((row['total_walks_allowed'].to_i + row['total_hits_allowed'].to_i) / row['total_innings'].to_f).round(2) : 0.0
  
  {
    games_played: games_played,
    at_bats: total_at_bats,
    hits: total_hits,
    doubles: row['total_doubles'].to_i,
    triples: row['total_triples'].to_i,
    home_runs: row['total_home_runs'].to_i,
    runs_batted_in: row['total_rbi'].to_i,
    runs_scored: row['total_runs'].to_i,
    walks: row['total_walks'].to_i,
    strikeouts: row['total_strikeouts'].to_i,
    stolen_bases: row['total_stolen_bases'].to_i,
    hit_by_pitch: row['total_hbp'].to_i,
    total_bases: row['total_bases'].to_i,
    batting_average: batting_average,
    on_base_percentage: on_base_percentage,
    slugging_percentage: slugging_percentage,
    ops: (on_base_percentage + slugging_percentage).round(3),
    innings_pitched: row['total_innings'].to_f,
    earned_runs: row['total_earned_runs'].to_i,
    hits_allowed: row['total_hits_allowed'].to_i,
    walks_allowed: row['total_walks_allowed'].to_i,
    strikeouts_pitched: row['total_strikeouts_pitched'].to_i,
    wins: row['total_wins'].to_i,
    losses: row['total_losses'].to_i,
    saves: row['total_saves'].to_i,
    era: era,
    whip: whip
  }.to_json
end

# Individual player game log
get '/api/v1/players/:id/game_log' do
  content_type :json
  result = db_connection.exec("
    SELECT s.*, g.opponent, g.game_date, g.team_score, g.opponent_score, g.home_team
    FROM stats s 
    JOIN games g ON s.game_id = g.id 
    WHERE s.player_id = $1
    ORDER BY g.game_date DESC
  ", [params[:id]])
  
  game_log = result.map do |row|
    batting_average = row['at_bats'].to_i > 0 ? (row['hits'].to_f / row['at_bats'].to_i).round(3) : 0.0
    on_base_percentage = (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i) > 0 ? 
      ((row['hits'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i).to_f / (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i)).round(3) : 0.0
    slugging_percentage = row['at_bats'].to_i > 0 ? (row['total_bases'].to_f / row['at_bats'].to_i).round(3) : 0.0
    era = row['innings_pitched'].to_f > 0 ? ((row['earned_runs'].to_i * 9.0) / row['innings_pitched'].to_f).round(2) : 0.0
    whip = row['innings_pitched'].to_f > 0 ? ((row['walks_allowed'].to_i + row['hits_allowed'].to_i) / row['innings_pitched'].to_f).round(2) : 0.0
    
    {
      id: row['id'].to_i,
      game_id: row['game_id'].to_i,
      at_bats: row['at_bats'].to_i,
      hits: row['hits'].to_i,
      doubles: row['doubles'].to_i,
      triples: row['triples'].to_i,
      home_runs: row['home_runs'].to_i,
      runs_batted_in: row['runs_batted_in'].to_i,
      runs_scored: row['runs_scored'].to_i,
      walks: row['walks'].to_i,
      strikeouts: row['strikeouts'].to_i,
      stolen_bases: row['stolen_bases'].to_i,
      hit_by_pitch: row['hit_by_pitch'].to_i,
      total_bases: row['total_bases'].to_i,
      innings_pitched: row['innings_pitched'].to_f,
      earned_runs: row['earned_runs'].to_i,
      hits_allowed: row['hits_allowed'].to_i,
      walks_allowed: row['walks_allowed'].to_i,
      strikeouts_pitched: row['strikeouts_pitched'].to_i,
      wins: row['wins'].to_i,
      losses: row['losses'].to_i,
      saves: row['saves'].to_i,
      batting_average: batting_average,
      on_base_percentage: on_base_percentage,
      slugging_percentage: slugging_percentage,
      era: era,
      whip: whip,
      game: {
        id: row['game_id'].to_i,
        opponent: row['opponent'],
        game_date: row['game_date'],
        formatted_date: Date.parse(row['game_date']).strftime('%B %d, %Y'),
        short_date: Date.parse(row['game_date']).strftime('%m/%d/%y'),
        team_score: row['team_score']&.to_i,
        opponent_score: row['opponent_score']&.to_i,
        home_team: row['home_team'] == 't',
        score_display: row['home_team'] == 't' ? "#{row['team_score']} - #{row['opponent_score']}" : "#{row['opponent_score']} - #{row['team_score']}",
        game_result: (row['team_score'].to_i > row['opponent_score'].to_i) ? 'W' : (row['team_score'].to_i < row['opponent_score'].to_i) ? 'L' : 'T'
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  game_log.to_json
end

# Individual player details with highlights and stats
get '/api/v1/players/:id' do
  content_type :json
  result = db_connection.exec("SELECT * FROM players WHERE id = $1", [params[:id]])
  return { error: 'Player not found' }.to_json, 404 if result.ntuples == 0
  
  player = result.first
  
  # Get player's highlights
  highlights_result = db_connection.exec("
    SELECT h.*, p.first_name, p.last_name 
    FROM highlights h 
    JOIN players p ON h.player_id = p.id 
    WHERE h.player_id = $1
    ORDER BY h.created_at DESC
  ", [params[:id]])
  
  highlights = highlights_result.map do |row|
    video_url = row['video_url']
    video_id = if video_url.include?('youtube.com/watch')
      video_url.split('v=').last.split('&').first
    elsif video_url.include?('youtu.be/')
      video_url.split('youtu.be/').last
    else
      nil
    end
    
    {
      id: row['id'].to_i,
      player_id: row['player_id'].to_i,
      title: row['title'],
      description: row['description'],
      video_url: video_url,
      video_embed_url: video_id ? "https://www.youtube.com/embed/#{video_id}" : video_url,
      thumbnail_url: video_id ? "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg" : nil,
      duration_seconds: row['duration_seconds']&.to_i,
      highlight_date: row['highlight_date'],
      formatted_date: Date.parse(row['created_at']).strftime('%B %d, %Y'),
      player: {
        id: row['player_id'].to_i,
        first_name: row['first_name'],
        last_name: row['last_name'],
        full_name: "#{row['first_name']} #{row['last_name']}"
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  
  # Get player's stats
  stats_result = db_connection.exec("
    SELECT s.*, g.opponent, g.game_date, g.team_score, g.opponent_score, g.home_team
    FROM stats s 
    JOIN games g ON s.game_id = g.id 
    WHERE s.player_id = $1
    ORDER BY g.game_date DESC
  ", [params[:id]])
  
  stats = stats_result.map do |row|
    batting_average = row['at_bats'].to_i > 0 ? (row['hits'].to_f / row['at_bats'].to_i).round(3) : 0.0
    on_base_percentage = (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i) > 0 ? 
      ((row['hits'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i).to_f / (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i)).round(3) : 0.0
    slugging_percentage = row['at_bats'].to_i > 0 ? (row['total_bases'].to_f / row['at_bats'].to_i).round(3) : 0.0
    era = row['innings_pitched'].to_f > 0 ? ((row['earned_runs'].to_i * 9.0) / row['innings_pitched'].to_f).round(2) : 0.0
    whip = row['innings_pitched'].to_f > 0 ? ((row['walks_allowed'].to_i + row['hits_allowed'].to_i) / row['innings_pitched'].to_f).round(2) : 0.0
    
    {
      id: row['id'].to_i,
      game_id: row['game_id'].to_i,
      at_bats: row['at_bats'].to_i,
      hits: row['hits'].to_i,
      doubles: row['doubles'].to_i,
      triples: row['triples'].to_i,
      home_runs: row['home_runs'].to_i,
      runs_batted_in: row['runs_batted_in'].to_i,
      runs_scored: row['runs_scored'].to_i,
      walks: row['walks'].to_i,
      strikeouts: row['strikeouts'].to_i,
      stolen_bases: row['stolen_bases'].to_i,
      hit_by_pitch: row['hit_by_pitch'].to_i,
      total_bases: row['total_bases'].to_i,
      innings_pitched: row['innings_pitched'].to_f,
      earned_runs: row['earned_runs'].to_i,
      hits_allowed: row['hits_allowed'].to_i,
      walks_allowed: row['walks_allowed'].to_i,
      strikeouts_pitched: row['strikeouts_pitched'].to_i,
      wins: row['wins'].to_i,
      losses: row['losses'].to_i,
      saves: row['saves'].to_i,
      batting_average: batting_average,
      on_base_percentage: on_base_percentage,
      slugging_percentage: slugging_percentage,
      era: era,
      whip: whip,
      game: {
        id: row['game_id'].to_i,
        opponent: row['opponent'],
        game_date: row['game_date'],
        formatted_date: Date.parse(row['game_date']).strftime('%B %d, %Y'),
        short_date: Date.parse(row['game_date']).strftime('%m/%d/%y'),
        team_score: row['team_score']&.to_i,
        opponent_score: row['opponent_score']&.to_i,
        home_team: row['home_team'] == 't',
        score_display: row['home_team'] == 't' ? "#{row['team_score']} - #{row['opponent_score']}" : "#{row['opponent_score']} - #{row['team_score']}",
        game_result: (row['team_score'].to_i > row['opponent_score'].to_i) ? 'W' : (row['team_score'].to_i < row['opponent_score'].to_i) ? 'L' : 'T'
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  
  # Calculate season stats summary
  season_stats = {}
  if stats.any?
    total_at_bats = stats.sum { |s| s[:at_bats] }
    total_hits = stats.sum { |s| s[:hits] }
    total_bases = stats.sum { |s| s[:total_bases] }
    total_walks = stats.sum { |s| s[:walks] }
    total_hbp = stats.sum { |s| s[:hit_by_pitch] }
    total_innings = stats.sum { |s| s[:innings_pitched] }
    total_earned_runs = stats.sum { |s| s[:earned_runs] }
    total_walks_allowed = stats.sum { |s| s[:walks_allowed] }
    total_hits_allowed = stats.sum { |s| s[:hits_allowed] }
    
    batting_average = total_at_bats > 0 ? (total_hits.to_f / total_at_bats).round(3) : 0.0
    on_base_percentage = (total_at_bats + total_walks + total_hbp) > 0 ? 
      ((total_hits + total_walks + total_hbp).to_f / (total_at_bats + total_walks + total_hbp)).round(3) : 0.0
    slugging_percentage = total_at_bats > 0 ? (total_bases.to_f / total_at_bats).round(3) : 0.0
    era = total_innings > 0 ? ((total_earned_runs * 9.0) / total_innings).round(2) : 0.0
    whip = total_innings > 0 ? ((total_walks_allowed + total_hits_allowed) / total_innings).round(2) : 0.0
    
    season_stats = {
      games_played: stats.count,
      at_bats: total_at_bats,
      hits: total_hits,
      doubles: stats.sum { |s| s[:doubles] },
      triples: stats.sum { |s| s[:triples] },
      home_runs: stats.sum { |s| s[:home_runs] },
      runs_batted_in: stats.sum { |s| s[:runs_batted_in] },
      runs_scored: stats.sum { |s| s[:runs_scored] },
      walks: total_walks,
      strikeouts: stats.sum { |s| s[:strikeouts] },
      stolen_bases: stats.sum { |s| s[:stolen_bases] },
      hit_by_pitch: total_hbp,
      total_bases: total_bases,
      batting_average: batting_average,
      on_base_percentage: on_base_percentage,
      slugging_percentage: slugging_percentage,
      ops: (on_base_percentage + slugging_percentage).round(3),
      innings_pitched: total_innings,
      earned_runs: total_earned_runs,
      hits_allowed: total_hits_allowed,
      walks_allowed: total_walks_allowed,
      strikeouts_pitched: stats.sum { |s| s[:strikeouts_pitched] },
      wins: stats.sum { |s| s[:wins] },
      losses: stats.sum { |s| s[:losses] },
      saves: stats.sum { |s| s[:saves] },
      era: era,
      whip: whip
    }
  end
  
  {
    id: player['id'].to_i,
    first_name: player['first_name'],
    last_name: player['last_name'],
    full_name: "#{player['first_name']} #{player['last_name']}",
    display_name: "#{player['jersey_number']}. #{player['first_name']} #{player['last_name']}",
    jersey_number: player['jersey_number'].to_i,
    position: player['position'],
    bio: player['bio'],
    height_inches: player['height_inches']&.to_i,
    weight_lbs: player['weight_lbs']&.to_i,
    birth_date: player['birth_date'],
    active: player['active'] == 't',
    photo_url: player['photo_url'],
    season_stats_summary: season_stats,
    highlights: highlights,
    stats: stats,
    created_at: player['created_at'],
    updated_at: player['updated_at']
  }.to_json
end



# Individual game stats
get '/api/v1/games/:id/stats' do
  content_type :json
  result = db_connection.exec("
    SELECT s.*, p.first_name, p.last_name, p.jersey_number, p.position
    FROM stats s 
    JOIN players p ON s.player_id = p.id 
    WHERE s.game_id = $1
    ORDER BY p.jersey_number
  ", [params[:id]])
  
  stats = result.map do |row|
    batting_average = row['at_bats'].to_i > 0 ? (row['hits'].to_f / row['at_bats'].to_i).round(3) : 0.0
    on_base_percentage = (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i) > 0 ? 
      ((row['hits'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i).to_f / (row['at_bats'].to_i + row['walks'].to_i + row['hit_by_pitch'].to_i)).round(3) : 0.0
    slugging_percentage = row['at_bats'].to_i > 0 ? (row['total_bases'].to_f / row['at_bats'].to_i).round(3) : 0.0
    era = row['innings_pitched'].to_f > 0 ? ((row['earned_runs'].to_i * 9.0) / row['innings_pitched'].to_f).round(2) : 0.0
    whip = row['innings_pitched'].to_f > 0 ? ((row['walks_allowed'].to_i + row['hits_allowed'].to_i) / row['innings_pitched'].to_f).round(2) : 0.0
    
    {
      id: row['id'].to_i,
      player_id: row['player_id'].to_i,
      game_id: row['game_id'].to_i,
      at_bats: row['at_bats'].to_i,
      hits: row['hits'].to_i,
      doubles: row['doubles'].to_i,
      triples: row['triples'].to_i,
      home_runs: row['home_runs'].to_i,
      runs_batted_in: row['runs_batted_in'].to_i,
      runs_scored: row['runs_scored'].to_i,
      walks: row['walks'].to_i,
      strikeouts: row['strikeouts'].to_i,
      stolen_bases: row['stolen_bases'].to_i,
      hit_by_pitch: row['hit_by_pitch'].to_i,
      total_bases: row['total_bases'].to_i,
      innings_pitched: row['innings_pitched'].to_f,
      earned_runs: row['earned_runs'].to_i,
      hits_allowed: row['hits_allowed'].to_i,
      walks_allowed: row['walks_allowed'].to_i,
      strikeouts_pitched: row['strikeouts_pitched'].to_i,
      wins: row['wins'].to_i,
      losses: row['losses'].to_i,
      saves: row['saves'].to_i,
      batting_average: batting_average,
      on_base_percentage: on_base_percentage,
      slugging_percentage: slugging_percentage,
      era: era,
      whip: whip,
      player: {
        id: row['player_id'].to_i,
        first_name: row['first_name'],
        last_name: row['last_name'],
        full_name: "#{row['first_name']} #{row['last_name']}",
        jersey_number: row['jersey_number'].to_i,
        position: row['position']
      },
      created_at: row['created_at'],
      updated_at: row['updated_at']
    }
  end
  stats.to_json
end

# Season stats (team leaders)
get '/api/v1/season/stats' do
  content_type :json
  season = params[:season] || Date.current.year
  
  # Batting leaders
  batting_leaders = db_connection.exec("
    SELECT p.first_name, p.last_name, p.jersey_number,
           SUM(s.at_bats) as total_at_bats,
           SUM(s.hits) as total_hits,
           SUM(s.home_runs) as total_home_runs,
           SUM(s.runs_batted_in) as total_rbi,
           SUM(s.runs_scored) as total_runs,
           SUM(s.stolen_bases) as total_stolen_bases,
           SUM(s.walks) as total_walks,
           SUM(s.total_bases) as total_bases
    FROM players p
    JOIN stats s ON p.id = s.player_id
    JOIN games g ON s.game_id = g.id
    WHERE p.active = true AND g.season = $1
    GROUP BY p.id, p.first_name, p.last_name, p.jersey_number
    HAVING SUM(s.at_bats) > 0
    ORDER BY SUM(s.hits) DESC
    LIMIT 10
  ", [season])
  
  # Pitching leaders
  pitching_leaders = db_connection.exec("
    SELECT p.first_name, p.last_name, p.jersey_number,
           SUM(s.innings_pitched) as total_innings,
           SUM(s.earned_runs) as total_earned_runs,
           SUM(s.strikeouts_pitched) as total_strikeouts,
           SUM(s.wins) as total_wins,
           SUM(s.losses) as total_losses,
           SUM(s.saves) as total_saves
    FROM players p
    JOIN stats s ON p.id = s.player_id
    JOIN games g ON s.game_id = g.id
    WHERE p.active = true AND g.season = $1
    GROUP BY p.id, p.first_name, p.last_name, p.jersey_number
    HAVING SUM(s.innings_pitched) > 0
    ORDER BY SUM(s.strikeouts_pitched) DESC
    LIMIT 10
  ", [season])
  
  {
    season: season,
    batting_leaders: batting_leaders.map do |row|
      total_at_bats = row['total_at_bats'].to_i
      total_hits = row['total_hits'].to_i
      total_bases = row['total_bases'].to_i
      total_walks = row['total_walks'].to_i
      
      batting_average = total_at_bats > 0 ? (total_hits.to_f / total_at_bats).round(3) : 0.0
      on_base_percentage = (total_at_bats + total_walks) > 0 ? ((total_hits + total_walks).to_f / (total_at_bats + total_walks)).round(3) : 0.0
      slugging_percentage = total_at_bats > 0 ? (total_bases.to_f / total_at_bats).round(3) : 0.0
      
      {
        player: {
          first_name: row['first_name'],
          last_name: row['last_name'],
          full_name: "#{row['first_name']} #{row['last_name']}",
          jersey_number: row['jersey_number'].to_i
        },
        at_bats: total_at_bats,
        hits: total_hits,
        home_runs: row['total_home_runs'].to_i,
        runs_batted_in: row['total_rbi'].to_i,
        runs_scored: row['total_runs'].to_i,
        stolen_bases: row['total_stolen_bases'].to_i,
        walks: total_walks,
        batting_average: batting_average,
        on_base_percentage: on_base_percentage,
        slugging_percentage: slugging_percentage,
        ops: (on_base_percentage + slugging_percentage).round(3)
      }
    end,
    pitching_leaders: pitching_leaders.map do |row|
      total_innings = row['total_innings'].to_f
      total_earned_runs = row['total_earned_runs'].to_i
      total_strikeouts = row['total_strikeouts'].to_i
      
      era = total_innings > 0 ? ((total_earned_runs * 9.0) / total_innings).round(2) : 0.0
      
      {
        player: {
          first_name: row['first_name'],
          last_name: row['last_name'],
          full_name: "#{row['first_name']} #{row['last_name']}",
          jersey_number: row['jersey_number'].to_i
        },
        innings_pitched: total_innings,
        earned_runs: total_earned_runs,
        strikeouts: total_strikeouts,
        wins: row['total_wins'].to_i,
        losses: row['total_losses'].to_i,
        saves: row['total_saves'].to_i,
        era: era
      }
    end
  }.to_json
end

# Simple test endpoint
get '/test' do
  content_type :json
  { status: 'ok', message: 'Server is running!' }.to_json
end

# Health check
get '/' do
  content_type :json
  begin
    # Try to connect to database to verify it's working
    db_connection.exec("SELECT 1")
    { 
      status: 'ok', 
      message: 'Peaks Baseball API is running!',
      database: 'connected'
    }.to_json
  rescue => e
    # If database fails, still return OK but note the issue
    { 
      status: 'ok', 
      message: 'Peaks Baseball API is running!',
      database: 'disconnected',
      error: e.message
    }.to_json
  end
end

puts "Starting Peaks Baseball API server on port #{ENV['PORT'] || 10000}..."
puts "API available at: http://localhost:#{ENV['PORT'] || 10000}"
puts "Health check: http://localhost:#{ENV['PORT'] || 10000}/"
puts "Test endpoint: http://localhost:#{ENV['PORT'] || 10000}/test"
puts "Players: http://localhost:#{ENV['PORT'] || 10000}/api/v1/players"
puts "Games: http://localhost:#{ENV['PORT'] || 10000}/api/v1/games"
puts "Stats: http://localhost:#{ENV['PORT'] || 10000}/api/v1/stats"
puts "Highlights: http://localhost:#{ENV['PORT'] || 10000}/api/v1/highlights"
puts "Roster: http://localhost:#{ENV['PORT'] || 10000}/api/v1/roster/stats"
puts "Environment: #{ENV['RACK_ENV'] || 'development'}"
puts "Database URL: #{ENV['DATABASE_URL'] ? 'Set' : 'Not set'}"
puts "Server starting..." 