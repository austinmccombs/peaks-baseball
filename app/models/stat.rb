class Stat < ApplicationRecord
  belongs_to :player
  belongs_to :game
  
  validates :player_id, presence: true
  validates :game_id, presence: true
  validates :player_id, uniqueness: { scope: :game_id, message: "already has stats for this game" }
  
  # Batting stats
  validates :at_bats, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :hits, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :doubles, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :triples, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :home_runs, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :runs_batted_in, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :runs_scored, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :walks, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :strikeouts, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :stolen_bases, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :hit_by_pitch, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Pitching stats
  validates :innings_pitched, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :earned_runs, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :hits_allowed, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :walks_allowed, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :strikeouts_pitched, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :wins, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :losses, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :saves, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  before_save :calculate_total_bases
  before_save :set_defaults
  
  def calculate_total_bases
    return unless at_bats && hits
    self.total_bases = (hits - doubles - triples - home_runs) + (doubles * 2) + (triples * 3) + (home_runs * 4)
  end
  
  def set_defaults
    # Set all nil values to 0 for easier calculations
    %w[at_bats hits doubles triples home_runs runs_batted_in runs_scored walks strikeouts stolen_bases hit_by_pitch innings_pitched earned_runs hits_allowed walks_allowed strikeouts_pitched wins losses saves].each do |field|
      self[field] = 0 if self[field].nil?
    end
  end
  
  def batting_average
    return 0.0 if at_bats.zero?
    (hits.to_f / at_bats).round(3)
  end
  
  def on_base_percentage
    return 0.0 if (at_bats + walks + hit_by_pitch).zero?
    ((hits + walks + hit_by_pitch).to_f / (at_bats + walks + hit_by_pitch)).round(3)
  end
  
  def slugging_percentage
    return 0.0 if at_bats.zero?
    (total_bases.to_f / at_bats).round(3)
  end
  
  def ops
    (on_base_percentage + slugging_percentage).round(3)
  end
  
  def era
    return 0.0 if innings_pitched.zero?
    ((earned_runs * 9.0) / innings_pitched).round(2)
  end
  
  def whip
    return 0.0 if innings_pitched.zero?
    ((walks_allowed + hits_allowed) / innings_pitched.to_f).round(2)
  end
end 