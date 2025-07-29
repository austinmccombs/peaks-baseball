class GameDetailSerializer < GameSerializer
  has_many :stats, serializer: StatSerializer
  
  def stats
    object.stats.includes(:player)
  end
end 