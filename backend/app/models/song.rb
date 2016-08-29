class Song < ApplicationRecord
  validates :mp3hash, uniqueness: true
end
