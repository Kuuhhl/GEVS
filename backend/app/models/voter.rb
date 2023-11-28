class Voter < ApplicationRecord
  validates_presence_of :full_name, :email, :date_of_birth, :unique_voter_code, :constituency
  validates_format_of :email, with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/, message: 'is not a valid email format'
  validates_uniqueness_of :email, message: 'is already registered'
  validate :date_of_birth_format
  validate :voter_code_valid_and_unique
  validate :valid_constituency

  private

  def date_of_birth_format
    unless date_of_birth.match?(/\A\d{2}-\d{2}-\d{4}\z/)
      errors.add(:date_of_birth, 'must be in the format DD-MM-YYYY')
    end
  end

  def voter_code_valid_and_unique
    if UniqueVoterCode.exists?(code: unique_voter_code) && Voter.exists?(unique_voter_code: unique_voter_code)
      errors.add(:unique_voter_code, 'is not valid or has already been assigned')
  end
end
  def valid_constituency
    unless Constituency.exists?(name: constituency)
      errors.add(:constituency, 'does not exist')
    end
  end
end