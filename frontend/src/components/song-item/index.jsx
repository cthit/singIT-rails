import React from 'react';
import moment from 'moment';
import styles from './styles.css';

const currentYear = moment().year()

const formatDate = (date) => {
  const momentDate = moment(date)

  if (currentYear === momentDate.year()) {
    return momentDate.format('D/M')
  } else {
    return momentDate.format('YYYY')
  }
}

const renderDate = (date) => (
    <div className={styles.date}>{formatDate(date)}</div>
)

const SongItem = ({ song, style = {} }) => {
  const imagePath = song.cover === null ? null : `/images/${song.song_hash}.png`

  return (
    <div style={style} key={song.song_hash} className={styles.song}>
      <div className={styles.cover} style={{ backgroundImage: `${imagePath ? `url(${imagePath}),` : ''} url(/default_cover.png)` }} />
      <div className={styles.info}>
        <div className={styles.title}>{song.title}</div>
        <div className={styles.artist}>{song.artist}</div>
      </div>
      {renderDate(song.created_at)}
    </div>
    )
}

export default SongItem