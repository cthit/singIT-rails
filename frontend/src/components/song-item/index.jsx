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

const SongItem = React.createClass({
  renderDate(date) {
    return (
      <div className={styles.date}>{formatDate(date)}</div>
    )
  },
  render() {
    const { song } = this.props
    const imagePath = song.cover === null ? "/default_cover.png" : `/images/${song.song_hash}.png`

    return (
      <div key={song.song_hash} className={styles.song}>
        <img src={imagePath} className={styles.cover} />
        <div className={styles.info}>
          <div className={styles.title}>{song.title}</div>
          <div className={styles.artist}>{song.artist}</div>
        </div>
        {this.renderDate(song.created_at)}
      </div>
      )
  }
})

export default SongItem