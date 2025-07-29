class GameSerializer < ActiveModel::Serializer
  attributes :id, :opponent, :game_date, :season, :home_team, :team_score, :opponent_score, :notes, :location, :formatted_date, :short_date, :score_display, :game_result, :created_at, :updated_at
  
  def formatted_date
    object.formatted_date
  end
  
  def short_date
    object.short_date
  end
  
  def score_display
    object.score_display
  end
  
  def game_result
    object.game_result
  end
end 