class PartyController < ApplicationController
  def get_all_parties
    parties = Party.includes(:candidates).all
    render json: parties.as_json(only: [:id, :name], include: { candidates: { only: [:id, :name] } })
  end
end
