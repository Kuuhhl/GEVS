class VotersController < ApplicationController
    def register
        @voter = Voter.new(voter_params)
    end

    if @voter.save
        render json: @voter, status: :created
    else
        render json: @voter.errors, status: :unprocessable_entity
    end

    private

    def voter_params
        params.require(:voter).permit(:email, :full_name, :date_of_birth, :password, :constituency, :unique_voter_code)
    end
end

