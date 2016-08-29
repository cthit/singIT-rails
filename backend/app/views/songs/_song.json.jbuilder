json.extract! song, :id, :title, :artist, :imageUrl, :mp3hash, :artistTitleHash, :created_at, :updated_at
json.url song_url(song, format: :json)