require "json"

file = File.read("example.json")
data_hash = JSON.parse(file)
data = data_hash.map do |key, value|
  {
    mp3hash: key,
    title: value['title'],
    artist: value['artist'],
    imageUrl: value['cover']
  }
end


puts JSON.dump(data)