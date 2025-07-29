Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :players, only: [:index, :show, :create, :update, :destroy] do
        member do
          get :highlights
          get :stats
          get :game_log
        end
      end
      
      resources :games, only: [:index, :show, :create, :update, :destroy] do
        member do
          get :stats
        end
      end
      
      resources :highlights, only: [:index, :show, :create, :update, :destroy]
      resources :stats, only: [:index, :show, :create, :update, :destroy]
      
      get 'roster/stats', to: 'players#roster_stats'
      get 'season/stats', to: 'stats#season_stats'
    end
  end
  
  # Serve React app for any non-API routes
  get '*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end 