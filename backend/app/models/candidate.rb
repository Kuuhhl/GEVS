class Candidate < ApplicationRecord
  belongs_to :party

  validates :name, presence: { message: "can't be blank" }
end