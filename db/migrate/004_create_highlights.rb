class CreateHighlights < ActiveRecord::Migration[6.1]
  def change
    create_table :highlights do |t|
      t.references :player, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.string :video_url, null: false
      t.string :thumbnail_url
      t.integer :duration_seconds
      t.date :highlight_date
      
      t.timestamps
    end
    
    add_index :highlights, :player_id
    add_index :highlights, :created_at
  end
end 