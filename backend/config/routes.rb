Rails.application.routes.draw do
  # public election stats api
  get "/gevs/constituency/:constituency_name" => "election#get_constituency_votes"
  get "/gevs/results" => "election#results"
  get "/gevs/status" => "election#status"
  get "/gevs/candidates" => "candidate#get_all_candidates"
  get "/gevs/parties" => "party#get_all_parties"

  # voter actions
  post "/voter/register" => "voters#register"
  post "/voter/login" => "voters#login"
  post "/voter/vote" => "voters#submit_vote"
  get "/voter/view_vote" => "voters#view_vote"
  put "/voter/change_credentials" => "voters#change_credentials"

  # admin actions
  post "/admin/login" => "admin#login"
  put "/admin/change_credentials" => "admin#change_credentials"
  get "/admin/action/election/start" => "admin#start_election"
  get "/admin/action/election/end" => "admin#end_election"

  # homepage / health page
  get "/homepage" => "homepage#index"
  get "up" => "rails/health#show", as: :rails_health_check
  root "homepage#index"
end
