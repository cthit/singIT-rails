class Song < ApplicationRecord
  validates :song_hash, uniqueness: true
  serialize :genres, Array

  def genre=(string)
    self.genres = string.downcase.split
  end
end
