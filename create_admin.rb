#!/usr/bin/env ruby

require 'pg'
require 'bcrypt'

puts "=== Admin User Creation Script ==="

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

# Check if admin user already exists
def admin_exists?(username)
  begin
    result = db_connection.exec("SELECT COUNT(*) as count FROM admin_users WHERE username = $1", [username])
    result.first['count'].to_i > 0
  rescue => e
    puts "Error checking admin existence: #{e.message}"
    false
  end
end

# Create admin user
def create_admin_user(username, password, email = nil)
  begin
    # Hash the password
    password_hash = BCrypt::Password.create(password)
    
    # Create the admin user
    result = db_connection.exec("
      INSERT INTO admin_users (username, password_hash, email, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, username, email, created_at
    ", [username, password_hash, email])
    
    admin_user = result.first
    puts "✅ Admin user created successfully!"
    puts "   ID: #{admin_user['id']}"
    puts "   Username: #{admin_user['username']}"
    puts "   Email: #{admin_user['email'] || 'Not provided'}"
    puts "   Created: #{admin_user['created_at']}"
    
    return true
  rescue => e
    puts "❌ Error creating admin user: #{e.message}"
    return false
  end
end

# Main execution
begin
  puts "Initializing database connection..."
  init_admin_users_table()
  
  # Get admin credentials from environment variables or command line
  username = ENV['ADMIN_USERNAME'] || ARGV[0]
  password = ENV['ADMIN_PASSWORD'] || ARGV[1]
  email = ENV['ADMIN_EMAIL'] || ARGV[2]
  
  if username.nil? || password.nil?
    puts "❌ Please provide username and password"
    puts "Usage: ruby create_admin.rb <username> <password> [email]"
    puts "Or set environment variables: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL"
    exit 1
  end
  
  if password.length < 8
    puts "❌ Password must be at least 8 characters long"
    exit 1
  end
  
  puts "Checking if admin user '#{username}' already exists..."
  if admin_exists?(username)
    puts "⚠️  Admin user '#{username}' already exists. Skipping creation."
    exit 0
  end
  
  puts "Creating admin user '#{username}'..."
  if create_admin_user(username, password, email)
    puts "🎉 Admin user setup complete!"
    puts "You can now log in at /admin/login with username: #{username}"
  else
    puts "❌ Failed to create admin user"
    exit 1
  end
  
rescue => e
  puts "❌ Database connection error: #{e.message}"
  puts "Make sure your DATABASE_URL environment variable is set correctly"
  exit 1
end 