class VotersController < ApplicationController
  def register
    @voter = Voter.new(voter_params)

    if @voter.save
      render json: @voter, status: :created
    else
      render json: @voter.errors, status: :unprocessable_entity
    end
  end

  def view_vote
    begin
      @voter = Voter.find(params[:id])
      if @voter.candidate_id.nil?
        render json: { error: "No vote casted" }, status: :not_found
      else
        render json: {
                 id: @voter.candidate.id,
                 name: @voter.candidate.name,
                 party: @voter.candidate.party.name,
               }, status: :ok
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Voter not found" }, status: :not_found
    end
  end

  private

  def voter_params
    params.require(:voter).permit(:email, :full_name, :date_of_birth, :password, :constituency, :unique_voter_code)
  end
end
