class ElectionController < ApplicationController
  def get_constituency_votes
    constituency_name = params[:constituency_name]

    election = Election.last
    if election.present? && election.status == "Pending" || election.status == "Completed"
      if Constituency.exists?(name: constituency_name)
        votes = Candidate.joins(:party, :voters)
          .where(voters: { constituency: constituency_name })
          .select("candidates.name AS candidate_name", "parties.name AS party_name", "COUNT(voters.id) AS vote_count")
          .group("candidates.id", "parties.id")
          .order("vote_count DESC")

        render json: {
          constituency: constituency_name,
          result: votes.map { |vote| { name: vote.candidate_name, party: vote.party_name, vote: vote.vote_count.to_s } },
        }
      else
        render json: { error: "Constituency does not exist" }, status: :not_found
      end
    else
      render json: { error: "No active election" }, status: :not_found
    end
  end

  def results
    election = Election.last
    if election.present? && election.status == "Pending" || election.status == "Completed"
      seats = Candidate.joins(:party, :voters)
        .select("parties.name AS party_name", "COUNT(voters.id) AS seat_count")
        .group("parties.id")
        .order("seat_count DESC")

      status = election.status
      winner = if seats.empty? && status == "Completed"
          "No votes cast - No winner"
        elsif status == "Completed"
          seats.first.seat_count > (seats.sum(&:seat_count) / 2) ? seats.first.party_name : "Hung Parliament"
        else
          "Pending"
        end

      render json: {
        status: status,
        winner: winner,
        seats: seats.map { |seat| { party: seat.party_name, seat: seat.seat_count.to_s } },
      }
    else
      render json: { error: "No active election" }, status: :not_found
    end
  end

  def status
    election = Election.last
    if election.present?
      render json: { status: election.status }, status: :ok
    else
      render json: { error: "No election exists" }, status: :not_found
    end
  end
end
