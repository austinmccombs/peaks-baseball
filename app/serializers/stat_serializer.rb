class StatSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :game_id, :at_bats, :hits, :doubles, :triples, :home_runs, :runs_batted_in, :runs_scored, :walks, :strikeouts, :stolen_bases, :hit_by_pitch, :total_bases, :innings_pitched, :earned_runs, :hits_allowed, :walks_allowed, :strikeouts_pitched, :wins, :losses, :saves, :batting_average, :on_base_percentage, :slugging_percentage, :ops, :era, :whip, :created_at, :updated_at
  
  belongs_to :player, serializer: PlayerSerializer
  belongs_to :game, serializer: GameSerializer
  
  def batting_average
    object.batting_average
  end
  
  def on_base_percentage
    object.on_base_percentage
  end
  
  def slugging_percentage
    object.slugging_percentage
  end
  
  def ops
    object.ops
  end
  
  def era
    object.era
  end
  
  def whip
    object.whip
  end
end 