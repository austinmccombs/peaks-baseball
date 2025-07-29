class Player < ApplicationRecord
  has_many :highlights, dependent: :destroy
  has_many :stats, dependent: :destroy
  has_many :games, through: :stats
  
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :jersey_number, presence: true, uniqueness: true
  validates :position, presence: true
  
  POSITIONS = %w[P C 1B 2B 3B SS LF CF RF DH].freeze
  
  scope :active, -> { where(active: true) }
  scope :by_position, ->(position) { where(position: position) }
  
  def full_name
    "#{first_name} #{last_name}"
  end
  
  def display_name
    "#{jersey_number}. #{full_name}"
  end
  
  def season_stats
    stats.joins(:game).where(games: { season: current_season })
  end
  
  def current_season
    # This could be made configurable
    Date.current.year
  end

  # Season totals for batting stats
  def season_at_bats
    season_stats.sum(:at_bats)
  end

  def season_hits
    season_stats.sum(:hits)
  end

  def season_doubles
    season_stats.sum(:doubles)
  end

  def season_triples
    season_stats.sum(:triples)
  end

  def season_home_runs
    season_stats.sum(:home_runs)
  end

  def season_runs_batted_in
    season_stats.sum(:runs_batted_in)
  end

  def season_runs_scored
    season_stats.sum(:runs_scored)
  end

  def season_walks
    season_stats.sum(:walks)
  end

  def season_strikeouts
    season_stats.sum(:strikeouts)
  end

  def season_stolen_bases
    season_stats.sum(:stolen_bases)
  end

  def season_hit_by_pitch
    season_stats.sum(:hit_by_pitch)
  end

  def season_total_bases
    season_stats.sum(:total_bases)
  end

  # Season totals for pitching stats
  def season_innings_pitched
    season_stats.sum(:innings_pitched)
  end

  def season_earned_runs
    season_stats.sum(:earned_runs)
  end

  def season_hits_allowed
    season_stats.sum(:hits_allowed)
  end

  def season_walks_allowed
    season_stats.sum(:walks_allowed)
  end

  def season_strikeouts_pitched
    season_stats.sum(:strikeouts_pitched)
  end

  def season_wins
    season_stats.sum(:wins)
  end

  def season_losses
    season_stats.sum(:losses)
  end

  def season_saves
    season_stats.sum(:saves)
  end
  
  def batting_average
    return 0.0 if season_at_bats.zero?
    (season_hits.to_f / season_at_bats).round(3)
  end
  
  def on_base_percentage
    return 0.0 if (season_at_bats + season_walks + season_hit_by_pitch).zero?
    ((season_hits + season_walks + season_hit_by_pitch).to_f / (season_at_bats + season_walks + season_hit_by_pitch)).round(3)
  end
  
  def slugging_percentage
    return 0.0 if season_at_bats.zero?
    (season_total_bases.to_f / season_at_bats).round(3)
  end
  
  def ops
    (on_base_percentage + slugging_percentage).round(3)
  end
  
  def era
    return 0.0 if season_innings_pitched.zero?
    ((season_earned_runs * 9.0) / season_innings_pitched).round(2)
  end
  
  def whip
    return 0.0 if season_innings_pitched.zero?
    ((season_walks_allowed + season_hits_allowed) / season_innings_pitched.to_f).round(2)
  end
end 