require "faker"

# Initialize default admin
Admin.find_or_create_by!(email: ENV["ADMIN_EMAIL"]) do |admin|
  admin.password = ENV["ADMIN_PASSWORD"]
end

# Create new Election
Election.first_or_create!

# Add the unique voter codes
["HH64FWPE", "BBMNS9ZJ", "KYMK9PUH", "WL3K3YPT", "JA9WCMAS", "Z93G7PN9", "WPC5GEHA", "RXLNLTA6", "7XUFD78Y", "DBP4GQBQ", "ZSRBTK9S", "B7DMPWCQ", "YADA47RL", "9GTZQNKB", "KSM9NB5L", "BQCRWTSG", "ML5NSKKG", "D5BG6FDH", "2LJFM6PM", "38NWLPY3", "2TEHRTHJ", "G994LD9T", "Q452KVQE", "75NKUXAH", "DHKVCU8T", "TH9A6HUB", "2E5BHT5R", "556JTA32", "LUFKZAHW", "DBAD57ZR", "K96JNSXY", "PFXB8QXM", "8TEXF2HD", "N6HBFD2X", "K3EVS3NM", "5492AC6V", "U5LGC65X", "BKMKJN5S", "JF2QD3UF", "NW9ETHS7", "VFBH8W6W", "7983XU4M", "2GYDT5D3", "LVTFN8G5", "UNP4A5T7", "UMT3RLVS", "TZZZCJV8", "UVE5M7FR", "W44QP7XJ", "9FCV9RMT"].each do |code|
  UniqueVoterCode.find_or_create_by!(code: code)
end

# Initialize the database with the constituencies
[
  "Shangri-la-Town",
  "Northern-Kunlun-Mountain",
  "Western-Shangri-la",
  "Naboo-Vallery",
  "New-Felucia",
].each do |name|
  Constituency.find_or_create_by!(name: name)
end

# Add the parties
parties = ["Blue Party", "Red Party", "Yellow Party", "Independent"]
parties.each { |name| Party.find_or_create_by!(name: name) }

# Initialize the database with the candidates
candidates = [
  {
    name: "Ansley Mendez",
    party: "Independent",
  },
  {
    name: "Branson Carter",
    party: "Independent",
  },
  {
    name: "Macie Owens",
    party: "Independent",
  },
  {
    name: "Karla Hays",
    party: "Red Party",
  },
  {
    name: "Miriam Bond",
    party: "Blue Party",
  },
  {
    name: "Tessa Horne",
    party: "Yellow Party",
  },
  {
    name: "Adrien Vaughan",
    party: "Blue Party",
  },
  {
    name: "Gisselle Kelly",
    party: "Independent",
  },
  {
    name: "Dillan Webster",
    party: "Yellow Party",
  },
  {
    name: "Alondra Lucas",
    party: "Independent",
  },
  {
    name: "Lukas Gaines",
    party: "Yellow Party",
  },
  {
    name: "Cristal Mcclure",
    party: "Yellow Party",
  },
  {
    name: "Brendon Martinez",
    party: "Red Party",
  },
  {
    name: "Makai Bowen",
    party: "Independent",
  },
  {
    name: "Ali Graves",
    party: "Independent",
  },
  {
    name: "Rayna Booker",
    party: "Blue Party",
  },
  {
    name: "Deja Hayes",
    party: "Blue Party",
  },
  {
    name: "Lia Costa",
    party: "Yellow Party",
  },
  {
    name: "Mary Cooper",
    party: "Red Party",
  },
  {
    name: "Giovanna Palmer",
    party: "Independent",
  },
  {
    name: "Molly Mack",
    party: "Yellow Party",
  },
  {
    name: "Nehemiah French",
    party: "Blue Party",
  },
  {
    name: "Brandon Mccoy",
    party: "Blue Party",
  },
  {
    name: "Areli Ponce",
    party: "Independent",
  },
  {
    name: "Ryleigh Nelson",
    party: "Yellow Party",
  },
  {
    name: "Brody Wu",
    party: "Blue Party",
  },
  {
    name: "Juliana Terry",
    party: "Red Party",
  },
  {
    name: "Carolina Richmond",
    party: "Red Party",
  },
  {
    name: "Josh Mccall",
    party: "Independent",
  },
  {
    name: "Ezequiel Chan",
    party: "Independent",
  },
  {
    name: "Hailey Carlson",
    party: "Red Party",
  },
  {
    name: "Roderick Cook",
    party: "Yellow Party",
  },
  {
    name: "Carlo Yoder",
    party: "Red Party",
  },
  {
    name: "Jayson Berry",
    party: "Red Party",
  },
  {
    name: "Mercedes Osborne",
    party: "Red Party",
  },
  {
    name: "Aydin Farley",
    party: "Red Party",
  },
  {
    name: "Alena Meyers",
    party: "Independent",
  },
  {
    name: "Jazmine Callahan",
    party: "Yellow Party",
  },
  {
    name: "Roman Walsh",
    party: "Independent",
  },
  {
    name: "Gavyn Herman",
    party: "Red Party",
  },
  {
    name: "Aimee Arellano",
    party: "Independent",
  },
  {
    name: "Santos Hartman",
    party: "Blue Party",
  },
  {
    name: "Matthew Salinas",
    party: "Red Party",
  },
  {
    name: "Dominique Salas",
    party: "Yellow Party",
  },
  {
    name: "Devon Archer",
    party: "Blue Party",
  },
  {
    name: "Nathanial Allison",
    party: "Yellow Party",
  },
  {
    name: "Houston Yu",
    party: "Blue Party",
  },
  {
    name: "Leilani Simpson",
    party: "Blue Party",
  },
  {
    name: "Lea Melendez",
    party: "Yellow Party",
  },
  {
    name: "Angie Bartlett",
    party: "Blue Party",
  },
  {
    name: "Noah Mcneil",
    party: "Red Party",
  },
  {
    name: "Sheldon Bass",
    party: "Red Party",
  },
  {
    name: "Belinda Martinez",
    party: "Independent",
  },
  {
    name: "Rene Franco",
    party: "Blue Party",
  },
  {
    name: "Madalyn Suarez",
    party: "Yellow Party",
  },
  {
    name: "George Arroyo",
    party: "Blue Party",
  },
  {
    name: "Jaydin Compton",
    party: "Independent",
  },
  {
    name: "Jenny Warren",
    party: "Red Party",
  },
  {
    name: "Karma Booker",
    party: "Blue Party",
  },
  {
    name: "Nylah Conner",
    party: "Yellow Party",
  },
  {
    name: "Allan Durham",
    party: "Blue Party",
  },
  {
    name: "Keith Robles",
    party: "Independent",
  },
  {
    name: "Kyan Dennis",
    party: "Yellow Party",
  },
  {
    name: "Elvis Tate",
    party: "Red Party",
  },
  {
    name: "Jaydan Romero",
    party: "Yellow Party",
  },
  {
    name: "Shayla Marks",
    party: "Yellow Party",
  },
  {
    name: "Anaya Riggs",
    party: "Blue Party",
  },
  {
    name: "Jayla Meza",
    party: "Blue Party",
  },
  {
    name: "Britney Patel",
    party: "Red Party",
  },
  {
    name: "Leila Calderon",
    party: "Red Party",
  },
  {
    name: "Alison Ware",
    party: "Red Party",
  },
  {
    name: "Angel Myers",
    party: "Red Party",
  },
  {
    name: "Aden Robles",
    party: "Red Party",
  },
  {
    name: "Hugh Vance",
    party: "Yellow Party",
  },
  {
    name: "Ada Esparza",
    party: "Blue Party",
  },
  {
    name: "Kristen Herman",
    party: "Blue Party",
  },
  {
    name: "Derek Todd",
    party: "Blue Party",
  },
  {
    name: "Priscilla Velazquez",
    party: "Red Party",
  },
  {
    name: "Krista Frazier",
    party: "Yellow Party",
  },
  {
    name: "Cullen Daugherty",
    party: "Blue Party",
  },
  {
    name: "Alijah Moody",
    party: "Blue Party",
  },
  {
    name: "Maritza Greer",
    party: "Blue Party",
  },
  {
    name: "Simeon Fields",
    party: "Blue Party",
  },
  {
    name: "Leonidas Gibson",
    party: "Blue Party",
  },
  {
    name: "Armani Manning",
    party: "Yellow Party",
  },
  {
    name: "Devan Ellis",
    party: "Independent",
  },
  {
    name: "Hayden Steele",
    party: "Red Party",
  },
  {
    name: "Marlee Best",
    party: "Independent",
  },
  {
    name: "Octavio Parsons",
    party: "Blue Party",
  },
  {
    name: "Jamarcus Hays",
    party: "Red Party",
  },
  {
    name: "Ezequiel Carroll",
    party: "Red Party",
  },
  {
    name: "Jon Trevino",
    party: "Blue Party",
  },
  {
    name: "Abagail Donaldson",
    party: "Red Party",
  },
  {
    name: "Soren Cardenas",
    party: "Red Party",
  },
  {
    name: "Dalia Dickerson",
    party: "Blue Party",
  },
  {
    name: "Jamya Huang",
    party: "Blue Party",
  },
  {
    name: "Amy Lynch",
    party: "Independent",
  },
  {
    name: "Ruben Espinoza",
    party: "Independent",
  },
  {
    name: "Lane Johnston",
    party: "Blue Party",
  },
  {
    name: "Sasha Perkins",
    party: "Blue Party",
  },
]
candidates.each do |candidate|
  Candidate.find_or_create_by!(name: candidate[:name], party: Party.find_by(name: candidate[:party]))
end

# create example votes
unique_voter_codes = UniqueVoterCode.pluck(:code)
candidate_ids = Candidate.pluck(:id)

for code in unique_voter_codes
  Voter.create(
    email: Faker::Internet.unique.email,
    full_name: Faker::Name.name,
    date_of_birth: Faker::Date.birthday(min_age: 18, max_age: 65).strftime("%Y-%m-%d"),
    password: "password",
    constituency: Constituency.pluck(:name).sample,
    unique_voter_code: code,
    candidate_id: 1,
  )
end
