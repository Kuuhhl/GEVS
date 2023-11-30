class UniqueVoterCode < ApplicationRecord
  validates :code, presence: true, uniqueness: true
end
