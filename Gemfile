source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '>= 3.0.0'

# Sinatra and web server
gem 'sinatra'
gem 'sinatra-cross_origin'
gem 'puma'

# Database
gem 'pg', '>= 0.18', '< 2.0'

# JSON handling
gem 'json'

# Development gems
group :development do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :test do
  gem 'rspec'
end 