json.extract! song, :id, :title, :artist, :cover, :song_hash, :genres, :created_at, :updated_at
json.url song_url(song, format: :json)