class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games do |t|
      t.string :opponent, null: false
      t.date :game_date, null: false
      t.integer :season, null: false
      t.boolean :home_team, default: true
      t.integer :team_score
      t.integer :opponent_score
      t.text :notes
      t.string :location
      
      t.timestamps
    end
    
    add_index :games, :game_date
    add_index :games, :season
    add_index :games, :opponent
  end
end 