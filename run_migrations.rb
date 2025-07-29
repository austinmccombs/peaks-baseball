#!/usr/bin/env ruby

require_relative 'config/environment'

puts "Running database migrations..."

# Run all pending migrations
ActiveRecord::Migration.migrate(ActiveRecord::Migration.current_version)

puts "Migrations completed successfully!" 