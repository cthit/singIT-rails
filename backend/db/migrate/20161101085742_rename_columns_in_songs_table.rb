class RenameColumnsInSongsTable < ActiveRecord::Migration[5.0]
  def change
    change_table :songs do |t|
      t.string :genres

      t.rename :imageUrl, :cover
      t.rename :mp3hash, :song_hash

      t.remove :artistTitleHash
    end
  end
end
