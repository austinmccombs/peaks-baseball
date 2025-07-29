FROM ruby:3.2-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install Ruby gems
RUN bundle install

# Copy the backend files
COPY server.rb ./
COPY config.ru ./
COPY run_migrations.rb ./
COPY db/ ./db/
COPY app/ ./app/

# Expose port
EXPOSE 10000

# Start the Sinatra API server
CMD ["bundle", "exec", "ruby", "server.rb"] 