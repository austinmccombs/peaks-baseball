FROM ruby:3.1-slim

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

# Copy the simple server for testing
COPY simple_server.rb ./

# Expose port
EXPOSE 3001

# Start the simple test server
CMD ["bundle", "exec", "ruby", "simple_server.rb"] 