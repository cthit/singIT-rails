//@flow

import React, {PropTypes} from 'react';
import fuzzy from 'fuzzy';
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
          {song.imageUrl != null
            ? <img src={song.imageUrl} className={styles.cover} />
            : <img src="/default_cover.png" className={styles.cover} />}
          <div className={styles.info}>
            <div className={styles.title}>{song.title}</div>
            <div className={styles.artist}>{song.artist}</div>
          </div>
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

        const searchOptions = { extract: e => `${e.artist} ${e.title}` };
        const searchResults = fuzzy.filter(searchString, songs, searchOptions);

        return (
            <div>
              <h1>singIT</h1>
              <input type="text"
                     className={styles.searchBox}
                     onChange={this.handleSearchInput}
                     value={searchString}
                     placeholder="Search" />
              <div className={styles.hits}>Hits: {searchString ? searchResults.length : songs.length}</div>
              {searchResults.map(s => this.renderSong(s.original))}
            </div>
        )
    }
});

export default Start