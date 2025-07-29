#!/usr/bin/env ruby

require 'webrick'
require 'json'
require 'pg'

# Database connection
def db_connection
  @db_connection ||= PG.connect(dbname: 'peaks_baseball_development')
end

# Create a simple HTTP server
class BaseballServer < WEBrick::HTTPServlet::AbstractServlet
  def do_GET(req, res)
    res['Content-Type'] = 'application/json'
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    
    case req.path
    when '/'
      res.body = { status: 'ok', message: 'Peaks Baseball API is running!' }.to_json
    when '/api/v1/players'
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
      res.body = players.to_json
    when '/api/v1/games'
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
      res.body = games.to_json
    when '/api/v1/highlights'
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
      res.body = highlights.to_json
    when '/api/v1/roster/stats'
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
      res.body = players.to_json
    else
      res.status = 404
      res.body = { error: 'Not found' }.to_json
    end
  end
  
  def do_OPTIONS(req, res)
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    res.status = 200
  end
end

# Start the server
server = WEBrick::HTTPServer.new(Port: 3001)
server.mount('/', BaseballServer)

puts "Starting Peaks Baseball API server on port 3001..."
puts "API available at: http://localhost:3001"
puts "Health check: http://localhost:3001/"
puts "Players: http://localhost:3001/api/v1/players"
puts "Games: http://localhost:3001/api/v1/games"
puts "Highlights: http://localhost:3001/api/v1/highlights"
puts "Roster: http://localhost:3001/api/v1/roster/stats"

trap('INT') { server.shutdown }
server.start 