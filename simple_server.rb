#!/usr/bin/env ruby

require 'sinatra'
require 'json'

puts "=== Starting Simple Test Server ==="
puts "Ruby version: #{RUBY_VERSION}"
puts "Port: #{ENV['PORT'] || 3001}"

set :port, ENV['PORT'] || 3001
set :bind, '0.0.0.0'

get '/test' do
  content_type :json
  { status: 'ok', message: 'Simple server is running!' }.to_json
end

get '/' do
  content_type :json
  { status: 'ok', message: 'Simple server is running!' }.to_json
end

puts "Server starting on port #{ENV['PORT'] || 3001}..." 