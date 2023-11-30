class Candidate < ApplicationRecord
  belongs_to :party
  has_many :voters

  validates :name, presence: { message: "can't be blank" }
end
