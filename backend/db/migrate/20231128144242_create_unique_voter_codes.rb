class CreateUniqueVoterCodes < ActiveRecord::Migration[7.1]
  def change
    create_table :unique_voter_codes do |t|
      t.string :code

      t.timestamps
    end
  end
end
