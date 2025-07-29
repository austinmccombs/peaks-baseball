class PlayerSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :full_name, :display_name, :jersey_number, :position, :bio, :height_inches, :weight_lbs, :birth_date, :active, :photo_url, :created_at, :updated_at
  
  def full_name
    object.full_name
  end
  
  def display_name
    object.display_name
  end
end 