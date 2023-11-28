Rails.application.routes.draw do
  post '/api/register' => 'voters#register'
  get "up" => "rails/health#show", as: :rails_health_check
end
