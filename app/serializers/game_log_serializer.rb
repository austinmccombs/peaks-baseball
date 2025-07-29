class GameLogSerializer < StatSerializer
  attributes :game_info
  
  def game_info
    {
      opponent: object.game.opponent,
      game_date: object.game.game_date,
      home_team: object.game.home_team,
      team_score: object.game.team_score,
      opponent_score: object.game.opponent_score,
      formatted_date: object.game.formatted_date,
      short_date: object.game.short_date,
      score_display: object.game.score_display,
      game_result: object.game.game_result
    }
  end
end 