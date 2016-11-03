class Song < ApplicationRecord
  validates :song_hash, uniqueness: true
  validates :title, :artist, presence: true
  serialize :genres, Array

  def genre=(string)
    self.genres = string.downcase.split
  end
end
