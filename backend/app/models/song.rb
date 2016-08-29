# == Schema Information
#
# Table name: songs
#
#  id         :integer          not null, primary key
#  title      :string
#  artist     :string
#  imageUrl   :string
#  mp3hash    :string
#  hash       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Song < ApplicationRecord
end
