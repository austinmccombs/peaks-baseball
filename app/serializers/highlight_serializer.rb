class HighlightSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :title, :description, :video_url, :thumbnail_url, :duration_seconds, :highlight_date, :video_embed_url, :formatted_date, :created_at, :updated_at
  
  belongs_to :player, serializer: PlayerSerializer
  
  def video_embed_url
    object.video_embed_url
  end
  
  def thumbnail_url
    object.thumbnail_url
  end
  
  def formatted_date
    object.formatted_date
  end
end 