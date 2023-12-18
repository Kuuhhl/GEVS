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
  post "/voter/verify-token" => "voters#verify_token"
  post "/voter/vote" => "voters#submit_vote"
  get "/voter/view_vote" => "voters#view_vote"
  put "/voter/change_credentials" => "voters#change_credentials"

  # admin actions
  post "/admin/login" => "admin#login"
  put "/admin/change_credentials" => "admin#change_credentials"
  put "/admin/action/election/start" => "admin#start_election"
  put "/admin/action/election/end" => "admin#end_election"
  put "/admin/action/election/reset" => "admin#reset_election"

  # homepage / health page
  get "/homepage" => "homepage#index"
  get "up" => "rails/health#show", as: :rails_health_check
  root "homepage#index"
end
