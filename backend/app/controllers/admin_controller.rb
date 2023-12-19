class AdminController < ApplicationController
  before_action :authenticate, only: [:change_credentials, :start_election, :end_election]

  def login
    admin = Admin.find_by(email: params[:email])

    if admin && admin.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: admin.id)
      render json: { token: token }
    else
      render json: { error: "Invalid credentials" }, status: :unauthorized
    end
  end

  def change_credentials
    admin = Admin.find(params[:id])

    if admin && admin.authenticate(params[:current_password])
      if params[:new_password].length < 6
        render json: { error: "New password should be at least 6 characters long" }, status: :unprocessable_entity
      else
        admin.update(email: params[:new_email], password: params[:new_password])
        render json: { message: "Credentials updated successfully" }
      end
    else
      render json: { error: "Invalid current password" }, status: :unauthorized
    end
  end

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

  def reset_election
    election = Election.last
    if election.present? && election.status == "Completed"
      election.update(status: "Not Started")
      Voter.destroy_all
      render json: { status: election.status }, status: :ok
    else
      render json: { error: "No completed election" }, status: :not_found
    end
  end

  private

  def admin_params
    params.permit(:email, :password)
  end

  def authenticate
    header = request.headers["Authorization"]
    token = header.split(" ").last if header.present?

    begin
      @decoded = JsonWebToken.decode(token)
      @current_user = Admin.find(@decoded[:user_id])
    rescue JWT::DecodeError
      render json: { error: "Invalid token." }, status: :unauthorized
    end
  end
end
