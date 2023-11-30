class Admin < User
  has_many :elections
  validate :singleton_guard

  def singleton_guard
    if Admin.count > 1
      errors.add(:base, "There can only be one admin")
    end
  end
end
