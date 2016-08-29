json.cache! @songs, expires_in: 1.hour do
	json.array! @songs, partial: 'songs/song', as: :song
end