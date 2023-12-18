class VotersController < ApplicationController
  before_action :authenticate, only: [:view_vote, :change_credentials, :submit_vote]

  def register
    voter = Voter.new(
      email: voter_params[:email],
      full_name: voter_params[:fullName],
      date_of_birth: voter_params[:dateOfBirth],
      password: voter_params[:password],
      constituency: voter_params[:constituency],
      unique_voter_code: voter_params[:uvc],
    )

    if voter.save
      token = JsonWebToken.encode(user_id: voter.id)
      render json: { token: token }, status: :created
    else
      render json: { error: voter.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique
    render json: { error: "Unique voter code already exists" }, status: :unprocessable_entity
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

  def verify_token
    header = request.headers["Authorization"]
    token = header.split(" ").last if header.present?

    begin
      decoded = JsonWebToken.decode(token)
      voter = Voter.find(decoded[:user_id])
      render json: { message: "Valid token" }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end

  def view_vote
    if @voter
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

  def submit_vote
    election = Election.last
    unless election.status == "Pending"
      render json: { error: "Election is not currently running" }, status: :bad_request
      return
    end

    if @voter.candidate_id.nil?
      candidate = Candidate.find_by(id: params[:candidate_id])
      if candidate.present?
        puts "Voter candidate id attribute before: " + @voter.candidate_id.to_s
        @voter.submit_vote(candidate.id)
        puts "Voter candidate id attribute after: " + @voter.candidate_id.to_s
        render json: { message: "Vote casted successfully" }, status: :ok
      else
        render json: { error: "Candidate does not exist" }, status: :not_found
      end
    else
      render json: { error: "Vote already casted" }, status: :bad_request
    end
  end

  private

  def voter_params
    params.permit(:email, :fullName, :dateOfBirth, :password, :constituency, :uvc)
  end

  def authenticate
    header = request.headers["Authorization"]
    token = header.split(" ").last if header.present?

    begin
      decoded = JsonWebToken.decode(token)
      @voter = Voter.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end
end
