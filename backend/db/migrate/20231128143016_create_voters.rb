class CreateVoters < ActiveRecord::Migration[7.1]
  def change
    create_table :voters do |t|
      t.string :email
      t.string :full_name
      t.string :date_of_birth
      t.string :password
      t.string :constituency
      t.string :unique_voter_code

      t.timestamps
    end
  end
end
