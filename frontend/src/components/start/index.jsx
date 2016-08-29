//@flow

import React, {PropTypes} from 'react';
import {fetchJson} from '../../services/backend';

import styles from './style.css'

const Start = React.createClass({
    getInitialState() {
      return {
        searchString: '',
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

    handleSearchInput(event) {
      this.setState({
        searchString: event.target.value
      })
    },

    render() {
        const { songs, searchString } = this.state;
        const searchboxStyles = [styles.searchBox];

        return (
            <div>
              <h1>singIT</h1>
              <input type="text"
                     className={searchboxStyles.join(' ')}
                     onChange={this.handleSearchInput}
                     value={searchString}
                     placeholder="Search" />
              {songs.map(this.renderSong)}
            </div>
        )
    }
});

export default Start
