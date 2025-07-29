class Api::V1::StatsController < ApplicationController
  before_action :set_stat, only: [:show, :update, :destroy]

  def index
    @stats = Stat.includes(:player, :game).order('games.game_date DESC')
    render json: @stats, each_serializer: StatSerializer
  end

  def show
    render json: @stat, serializer: StatSerializer
  end

  def create
    @stat = Stat.new(stat_params)
    if @stat.save
      render json: @stat, serializer: StatSerializer, status: :created
    else
      render json: { errors: @stat.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @stat.update(stat_params)
      render json: @stat, serializer: StatSerializer
    else
      render json: { errors: @stat.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @stat.destroy
    render json: { message: 'Stat deleted successfully' }
  end

  def season_stats
    season = params[:season] || Date.current.year
    @stats = Stat.joins(:player, :game)
                 .where(games: { season: season })
                 .includes(:player, :game)
                 .order('players.jersey_number')
    
    render json: @stats, each_serializer: SeasonStatsSerializer
  end

  private

  def set_stat
    @stat = Stat.find(params[:id])
  end

  def stat_params
    params.require(:stat).permit(
      :player_id, :game_id,
      # Batting stats
      :at_bats, :hits, :doubles, :triples, :home_runs, :runs_batted_in,
      :runs_scored, :walks, :strikeouts, :stolen_bases, :hit_by_pitch,
      # Pitching stats
      :innings_pitched, :earned_runs, :hits_allowed, :walks_allowed,
      :strikeouts_pitched, :wins, :losses, :saves
    )
  end
end 