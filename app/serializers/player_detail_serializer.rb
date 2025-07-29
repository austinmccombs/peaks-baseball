class PlayerDetailSerializer < PlayerSerializer
  attributes :season_stats_summary, :recent_highlights
  
  has_many :highlights, serializer: HighlightSerializer
  
  def season_stats_summary
    stats = object.season_stats
    return {} if stats.empty?
    
    {
      games_played: stats.count,
      at_bats: stats.sum(:at_bats),
      hits: stats.sum(:hits),
      doubles: stats.sum(:doubles),
      triples: stats.sum(:triples),
      home_runs: stats.sum(:home_runs),
      runs_batted_in: stats.sum(:runs_batted_in),
      runs_scored: stats.sum(:runs_scored),
      walks: stats.sum(:walks),
      strikeouts: stats.sum(:strikeouts),
      stolen_bases: stats.sum(:stolen_bases),
      hit_by_pitch: stats.sum(:hit_by_pitch),
      total_bases: stats.sum(:total_bases),
      batting_average: object.batting_average,
      on_base_percentage: object.on_base_percentage,
      slugging_percentage: object.slugging_percentage,
      ops: object.ops,
      innings_pitched: stats.sum(:innings_pitched),
      earned_runs: stats.sum(:earned_runs),
      hits_allowed: stats.sum(:hits_allowed),
      walks_allowed: stats.sum(:walks_allowed),
      strikeouts_pitched: stats.sum(:strikeouts_pitched),
      wins: stats.sum(:wins),
      losses: stats.sum(:losses),
      saves: stats.sum(:saves),
      era: object.era,
      whip: object.whip
    }
  end
  
  def recent_highlights
    object.highlights.limit(5).map do |highlight|
      {
        id: highlight.id,
        title: highlight.title,
        video_url: highlight.video_url,
        thumbnail_url: highlight.thumbnail_url,
        created_at: highlight.created_at
      }
    end
  end
end 