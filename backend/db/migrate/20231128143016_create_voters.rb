class CreateVoters < ActiveRecord::Migration[7.1]
  def change
    create_table :voters do |t|
      t.string :email, null: false
      t.string :full_name, null: false
      t.string :date_of_birth, null: false
      t.string :password
      t.string :constituency, null: false
      t.string :unique_voter_code, null: false
      t.references :candidate, foreign_key: true

      t.timestamps
    end
    add_index :voters, :email, unique: true
    add_index :voters, :unique_voter_code, unique: true
  end
end
