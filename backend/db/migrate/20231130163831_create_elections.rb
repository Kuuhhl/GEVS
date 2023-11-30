class CreateElections < ActiveRecord::Migration[7.1]
  def change
    create_table :elections do |t|
      t.string :status, default: "Not Started"

      t.timestamps
    end
  end
end
