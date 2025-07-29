class Api::V1::HighlightsController < ApplicationController
  before_action :set_highlight, only: [:show, :update, :destroy]

  def index
    @highlights = Highlight.includes(:player).recent
    render json: @highlights, each_serializer: HighlightSerializer
  end

  def show
    render json: @highlight, serializer: HighlightSerializer
  end

  def create
    @highlight = Highlight.new(highlight_params)
    if @highlight.save
      render json: @highlight, serializer: HighlightSerializer, status: :created
    else
      render json: { errors: @highlight.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @highlight.update(highlight_params)
      render json: @highlight, serializer: HighlightSerializer
    else
      render json: { errors: @highlight.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @highlight.destroy
    render json: { message: 'Highlight deleted successfully' }
  end

  private

  def set_highlight
    @highlight = Highlight.find(params[:id])
  end

  def highlight_params
    params.require(:highlight).permit(
      :player_id, :title, :description, :video_url, :thumbnail_url,
      :duration_seconds, :highlight_date
    )
  end
end 