FROM ruby:3.2-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install Ruby gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Install Node.js dependencies for the client
WORKDIR /app/client
RUN npm install

# Build the React app
RUN npm run build

# Switch back to app directory
WORKDIR /app

# Create a non-root user
RUN useradd -m appuser
USER appuser

# Expose port
EXPOSE 3001

# Start the application
CMD ["ruby", "server.rb"] 