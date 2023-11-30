class VotersController < ApplicationController
  before_action :authenticate, only: [:view_vote, :change_credentials]

  def register
    voter = Voter.new(voter_params)

    if voter.save
      token = JsonWebToken.encode(user_id: voter.id)
      render json: { token: token }, status: :created
    else
      render json: { error: voter.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    voter = Voter.find_by(email: params[:email])

    if voter && voter.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: voter.id)
      render json: { token: token }
    else
      render json: { error: "Invalid credentials" }, status: :unauthorized
    end
  end

  def view_vote
    if @voter.id == params[:id].to_i
      if @voter.candidate_id.nil?
        render json: { error: "No vote casted" }, status: :not_found
      else
        render json: {
                 id: @voter.candidate.id,
                 name: @voter.candidate.name,
                 party: @voter.candidate.party.name,
               }, status: :ok
      end
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def change_credentials
    voter = Voter.find(params[:id])

    if voter && voter.authenticate(params[:current_password])
      if params[:new_password].length < 6
        render json: { error: "New password should be at least 6 characters long" }, status: :unprocessable_entity
      else
        voter.update(email: params[:new_email], password: params[:new_password])
        render json: { message: "Credentials updated successfully" }
      end
    else
      render json: { error: "Invalid current password" }, status: :unauthorized
    end
  end

  private

  def voter_params
    params.require(:voter).permit(:email, :full_name, :date_of_birth, :password, :constituency, :unique_voter_code)
  end

  def authenticate
    header = request.headers["Authorization"]
    token = header.split(" ").last if header.present?

    begin
      decoded = JsonWebToken.decode(token)
      voter = Voter.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end
end
