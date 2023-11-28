class Admin < ApplicationRecord
    validates :email, presence: { message: "can't be blank" }, format: { with: URI::MailTo::EMAIL_REGEXP, message: "is not a valid email" }
    validates :password, presence: { message: "can't be blank" }
    validate :only_one_admin

    def only_one_admin
        if Admin.count > 1
            errors.add(:base, "There can only be one admin")
        end
    end
end
