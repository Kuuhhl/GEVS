Rails.application.routes.draw do
  post '/api/register' => 'voters#register'
  get '/homepage' => 'homepage#index'
  get "up" => "rails/health#show", as: :rails_health_check
  root "homepage#index"
end
