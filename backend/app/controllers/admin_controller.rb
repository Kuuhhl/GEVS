class AdminController < ApplicationController
  def start_election
    election = Election.last || Election.create(status: "Not Started")

    case election.status
    when "Not Started"
      election.update(status: "Pending")
      render json: { status: election.status }, status: :ok
    when "Pending"
      render json: { error: "Election already started" }, status: :bad_request
    when "Completed"
      render json: { error: "Election already completed" }, status: :bad_request
    end
  end

  def end_election
    election = Election.last
    if election.present? && election.status == "Pending"
      election.update(status: "Completed")
      render json: { status: election.status }, status: :ok
    else
      render json: { error: "No active election" }, status: :not_found
    end
  end
end
