FROM ruby:2.5-slim

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

# Copy the backend files only (exclude client directory)
COPY server.rb ./
COPY config.ru ./
COPY run_migrations.rb ./
COPY db/ ./db/
COPY app/ ./app/

# Create a non-root user
RUN useradd -m appuser
USER appuser

# Expose port
EXPOSE 3001

# Start the Sinatra API server
CMD ["ruby", "server.rb"] 