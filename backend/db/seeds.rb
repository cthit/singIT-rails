# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Song.create!([
	{
		"title" => "Horvs vaggvisa",
		"artist" => "Horv",
		"mp3hash" => "13371337",
		"artistTitleHash" => "1337",
		"imageUrl" => "http://www.hotel-r.net/im/hotel/ch/happy-24.jpg"

	},
	{
		"title" => "Holmus sexballad",
		"artist" => "Holmus",
		"mp3hash" => "13371338",
		"artistTitleHash" => "1338",
		"imageUrl" => "https://cdn.meme.am/instances/500x/29815779.jpg"
	}
])
