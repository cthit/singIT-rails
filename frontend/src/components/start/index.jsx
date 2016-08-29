//@flow

import React, {PropTypes} from 'react';
import {fetchJson} from '../../services/backend';

import styles from './style.css'

const Start = React.createClass({
    getInitialState() {
      return {
        songs: []
      };
    },

    componentDidMount() {
        fetchJson('/api/songs.json').then(songs => this.setState({songs}));
    },

    renderSong(song) {
      return (
        <div key={song.id} className={styles.song}>
          <div className={styles.title}>{song.title}</div>
          <div className={styles.artist}>{song.artist}</div>
        </div>
      )
    },

    render() {
        const songs = this.state.songs;
        return (
            <div>
              <h1>singIT</h1>
              <div className={styles.searchBox}>Search</div>
              {songs.map(this.renderSong)}
            </div>
        )
    }
});

export default Start
