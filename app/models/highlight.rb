class Highlight < ApplicationRecord
  belongs_to :player
  
  validates :title, presence: true
  validates :video_url, presence: true
  validates :player_id, presence: true
  
  scope :recent, -> { order(created_at: :desc) }
  scope :by_player, ->(player_id) { where(player_id: player_id) }
  
  def video_embed_url
    # Convert YouTube URLs to embed format
    if video_url.include?('youtube.com/watch')
      video_id = video_url.split('v=').last.split('&').first
      "https://www.youtube.com/embed/#{video_id}"
    elsif video_url.include?('youtu.be/')
      video_id = video_url.split('youtu.be/').last
      "https://www.youtube.com/embed/#{video_id}"
    else
      video_url
    end
  end
  
  def thumbnail_url
    # Generate YouTube thumbnail URL
    if video_url.include?('youtube.com/watch')
      video_id = video_url.split('v=').last.split('&').first
      "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg"
    elsif video_url.include?('youtu.be/')
      video_id = video_url.split('youtu.be/').last
      "https://img.youtube.com/vi/#{video_id}/maxresdefault.jpg"
    else
      nil
    end
  end
  
  def formatted_date
    created_at.strftime('%B %d, %Y')
  end
end 