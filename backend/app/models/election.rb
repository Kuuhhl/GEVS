class Election < ApplicationRecord
  validate :singleton_guard, on: :create

  def singleton_guard
    errors.add(:base, "There can only be one Election.") unless Election.count.zero?
  end
end
