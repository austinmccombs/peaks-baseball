#!/usr/bin/env ruby

require 'pg'

puts "=== Clearing Test Data from Production Database ==="

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
  
  puts "Clearing all test data..."
  
  # Delete in order to respect foreign key constraints
  db.exec("DELETE FROM highlights")
  puts "✅ Cleared highlights table"
  
  db.exec("DELETE FROM stats")
  puts "✅ Cleared stats table"
  
  db.exec("DELETE FROM games")
  puts "✅ Cleared games table"
  
  db.exec("DELETE FROM players")
  puts "✅ Cleared players table"
  
  puts "✅ All test data cleared successfully!"
  puts "Database is now clean and ready for real data"
  
rescue => e
  puts "❌ Error clearing test data: #{e.message}"
  puts "Full error: #{e}"
end 