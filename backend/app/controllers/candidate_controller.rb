class CandidateController < ApplicationController
  def get_all_candidates
    candidates = Candidate.all.includes(:party)
    grouped_candidates = candidates.group_by { |candidate| candidate.party.name }
    render json: grouped_candidates.transform_values { |candidates| candidates.map { |candidate| { id: candidate.id, name: candidate.name } } }
  end
end
