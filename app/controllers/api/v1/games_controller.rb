class Api::V1::GamesController < ApplicationController
  before_action :set_game, only: [:show, :update, :destroy, :stats]

  def index
    @games = Game.order(game_date: :desc)
    render json: @games, each_serializer: GameSerializer
  end

  def show
    render json: @game, serializer: GameDetailSerializer
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      render json: @game, serializer: GameSerializer, status: :created
    else
      render json: { errors: @game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @game.update(game_params)
      render json: @game, serializer: GameSerializer
    else
      render json: { errors: @game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @game.destroy
    render json: { message: 'Game deleted successfully' }
  end

  def stats
    @stats = @game.stats.includes(:player)
    render json: @stats, each_serializer: StatSerializer
  end

  private

  def set_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit(
      :opponent, :game_date, :season, :home_team, :team_score,
      :opponent_score, :notes, :location
    )
  end
end 