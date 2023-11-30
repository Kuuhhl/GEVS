class Voter < User
  belongs_to :candidate, optional: true
  validates_presence_of :full_name, :email, :date_of_birth, :unique_voter_code, :constituency, :password
  validates_format_of :email, with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/, message: "is not a valid email format"
  validate :date_of_birth_format
  validate :voter_code_valid_and_unique
  validate :valid_constituency

  def submit_vote(candidate_id)
    self.candidate_id = candidate_id
    save
  end

  private

  def date_of_birth_format
    if date_of_birth.nil?
      errors.add(:date_of_birth, "can't be blank")
    elsif !date_of_birth.match?(/\A\d{4}-\d{2}-\d{2}\z/)
      errors.add(:date_of_birth, "must be in the format YYYY-MM-DD")
    end
  end

  def voter_code_valid_and_unique
    if UniqueVoterCode.exists?(code: unique_voter_code) && Voter.exists?(unique_voter_code: unique_voter_code)
      puts "Voter code already exists"
      errors.add(:unique_voter_code, "is not valid or has already been assigned")
    end
  end

  def valid_constituency
    unless Constituency.exists?(name: constituency)
      errors.add(:constituency, "does not exist")
    end
  end
end
