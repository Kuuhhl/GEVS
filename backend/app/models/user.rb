class User < ApplicationRecord
  self.abstract_class = true
  has_secure_password

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6, message: "should be at least 6 characters long" }, if: -> { new_record? || !password.nil? }
end
