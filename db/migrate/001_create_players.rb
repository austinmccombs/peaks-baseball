class CreatePlayers < ActiveRecord::Migration[6.1]
  def change
    create_table :players do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.integer :jersey_number, null: false
      t.string :position, null: false
      t.text :bio
      t.integer :height_inches
      t.integer :weight_lbs
      t.date :birth_date
      t.boolean :active, default: true
      t.string :photo_url
      
      t.timestamps
    end
    
    add_index :players, :jersey_number, unique: true
    add_index :players, :position
    add_index :players, :active
  end
end 