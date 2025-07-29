#!/usr/bin/env ruby

require 'pg'

puts "=== Running Database Setup ==="

# Connect to the database
begin
  if ENV['DATABASE_URL']
    puts "Connecting to production database..."
    db = PG.connect(ENV['DATABASE_URL'])
  else
    puts "Connecting to development database..."
    db = PG.connect(dbname: 'peaks_baseball_development')
  end
  
  puts "Connected successfully!"
  
  # Read and execute the setup SQL
  puts "Reading setup_database.sql..."
  sql_content = File.read('setup_database.sql')
  
  puts "Executing database setup..."
  db.exec(sql_content)
  
  puts "✅ Database setup completed successfully!"
  puts "Tables created: players, games, stats, highlights"
  puts "Sample data inserted"
  
rescue => e
  puts "❌ Error setting up database: #{e.message}"
  puts "Full error: #{e}"
end 