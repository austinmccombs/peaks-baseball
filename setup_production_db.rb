#!/usr/bin/env ruby

require 'pg'

puts "=== Setting up Production Database ==="

# This script should be run on Render with the DATABASE_URL environment variable set
unless ENV['DATABASE_URL']
  puts "❌ DATABASE_URL environment variable not set!"
  puts "This script should be run on Render where DATABASE_URL is automatically set."
  exit 1
end

begin
  puts "Connecting to production database..."
  db = PG.connect(ENV['DATABASE_URL'])
  puts "Connected successfully!"
  
  # Read and execute the clean setup SQL (no sample data)
  puts "Reading setup_database_clean.sql..."
  sql_content = File.read('setup_database_clean.sql')
  
  puts "Executing database setup..."
  db.exec(sql_content)
  
  puts "✅ Production database setup completed successfully!"
  puts "Tables created: players, games, stats, highlights"
  puts "Clean database ready for production use"
  
rescue => e
  puts "❌ Error setting up production database: #{e.message}"
  puts "Full error: #{e}"
end 