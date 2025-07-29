FROM ruby:2.5.0

# Install system dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install Ruby gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Create a non-root user
RUN useradd -m myuser && chown -R myuser:myuser /app
USER myuser

# Expose port
EXPOSE 3001

# Start the application
CMD ["ruby", "server.rb"] 