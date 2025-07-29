class CreateStats < ActiveRecord::Migration[6.1]
  def change
    create_table :stats do |t|
      t.references :player, null: false, foreign_key: true
      t.references :game, null: false, foreign_key: true
      
      # Batting stats
      t.integer :at_bats, default: 0
      t.integer :hits, default: 0
      t.integer :doubles, default: 0
      t.integer :triples, default: 0
      t.integer :home_runs, default: 0
      t.integer :runs_batted_in, default: 0
      t.integer :runs_scored, default: 0
      t.integer :walks, default: 0
      t.integer :strikeouts, default: 0
      t.integer :stolen_bases, default: 0
      t.integer :hit_by_pitch, default: 0
      t.integer :total_bases, default: 0
      
      # Pitching stats
      t.decimal :innings_pitched, precision: 3, scale: 1, default: 0
      t.integer :earned_runs, default: 0
      t.integer :hits_allowed, default: 0
      t.integer :walks_allowed, default: 0
      t.integer :strikeouts_pitched, default: 0
      t.integer :wins, default: 0
      t.integer :losses, default: 0
      t.integer :saves, default: 0
      
      t.timestamps
    end
    
    add_index :stats, [:player_id, :game_id], unique: true
  end
end 