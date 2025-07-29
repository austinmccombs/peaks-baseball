source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.0'

# Rails API
gem 'rails', '~> 6.1.0'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 4.1'

# API and Serialization
gem 'rack-cors'
gem 'active_model_serializers', '~> 0.10.0'

# Authentication (if needed later)
# gem 'devise'
# gem 'devise_token_auth'

# File uploads
gem 'carrierwave'
gem 'mini_magick'

# Background jobs
gem 'sidekiq'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'rspec-rails'
  gem 'factory_bot_rails'
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'shoulda-matchers'
  gem 'faker'
end 