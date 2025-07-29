class Game < ApplicationRecord
  has_many :stats, dependent: :destroy
  has_many :players, through: :stats
  
  validates :opponent, presence: true
  validates :game_date, presence: true
  validates :season, presence: true
  
  scope :by_season, ->(season) { where(season: season) }
  scope :recent, -> { order(game_date: :desc) }
  
  def home_game?
    home_team == true
  end
  
  def away_game?
    !home_game?
  end
  
  def game_result
    return 'W' if team_score > opponent_score
    return 'L' if team_score < opponent_score
    'T'
  end
  
  def formatted_date
    game_date.strftime('%B %d, %Y')
  end
  
  def short_date
    game_date.strftime('%m/%d/%y')
  end
  
  def score_display
    if home_game?
      "#{team_score} - #{opponent_score}"
    else
      "#{opponent_score} - #{team_score}"
    end
  end
end 