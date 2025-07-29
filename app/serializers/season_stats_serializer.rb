class SeasonStatsSerializer < StatSerializer
  attributes :player_info, :season_totals
  
  def player_info
    {
      id: object.player.id,
      first_name: object.player.first_name,
      last_name: object.player.last_name,
      full_name: object.player.full_name,
      display_name: object.player.display_name,
      jersey_number: object.player.jersey_number,
      position: object.player.position
    }
  end
  
  def season_totals
    # This would need to be calculated from all stats for the player in the season
    # For now, returning the individual stat data
    {
      games_played: 1, # This would need to be calculated
      at_bats: object.at_bats,
      hits: object.hits,
      doubles: object.doubles,
      triples: object.triples,
      home_runs: object.home_runs,
      runs_batted_in: object.runs_batted_in,
      runs_scored: object.runs_scored,
      walks: object.walks,
      strikeouts: object.strikeouts,
      stolen_bases: object.stolen_bases,
      hit_by_pitch: object.hit_by_pitch,
      total_bases: object.total_bases,
      batting_average: object.batting_average,
      on_base_percentage: object.on_base_percentage,
      slugging_percentage: object.slugging_percentage,
      ops: object.ops,
      innings_pitched: object.innings_pitched,
      earned_runs: object.earned_runs,
      hits_allowed: object.hits_allowed,
      walks_allowed: object.walks_allowed,
      strikeouts_pitched: object.strikeouts_pitched,
      wins: object.wins,
      losses: object.losses,
      saves: object.saves,
      era: object.era,
      whip: object.whip
    }
  end
end 