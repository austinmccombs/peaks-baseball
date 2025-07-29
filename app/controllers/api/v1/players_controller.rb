class Api::V1::PlayersController < ApplicationController
  before_action :set_player, only: [:show, :update, :destroy, :highlights, :stats, :game_log]

  def index
    @players = Player.active.order(:jersey_number)
    render json: @players, each_serializer: PlayerSerializer
  end

  def show
    render json: @player, serializer: PlayerDetailSerializer
  end

  def create
    @player = Player.new(player_params)
    if @player.save
      render json: @player, serializer: PlayerSerializer, status: :created
    else
      render json: { errors: @player.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @player.update(player_params)
      render json: @player, serializer: PlayerSerializer
    else
      render json: { errors: @player.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @player.update(active: false)
    render json: { message: 'Player deactivated successfully' }
  end

  def highlights
    @highlights = @player.highlights.recent
    render json: @highlights, each_serializer: HighlightSerializer
  end

  def stats
    @stats = @player.stats.includes(:game).order('games.game_date DESC')
    render json: @stats, each_serializer: StatSerializer
  end

  def game_log
    @stats = @player.stats.includes(:game).order('games.game_date DESC')
    render json: @stats, each_serializer: GameLogSerializer
  end

  def roster_stats
    @players = Player.active.includes(:stats).order(:jersey_number)
    render json: @players, each_serializer: RosterStatsSerializer
  end

  private

  def set_player
    @player = Player.find(params[:id])
  end

  def player_params
    params.require(:player).permit(
      :first_name, :last_name, :jersey_number, :position, :bio,
      :height_inches, :weight_lbs, :birth_date, :photo_url, :active
    )
  end
end 