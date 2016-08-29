//@flow

import React, {PropTypes} from 'react';
import fuzzy from 'fuzzy';
import _ from 'lodash';
import {fetchJson} from '../../services/backend';

import styles from './style.css'

const Start = React.createClass({
    getInitialState() {
      return {
        searchString: '',
        songs: [],
        filteredSongs: []
      };
    },

    componentDidMount() {
        this.debouncedPerformSearch = _.debounce(this.performSearch, 300);
        fetchJson('/api/songs.json').then(songs => this.setState({
          songs,
          filteredSongs: songs
        }));
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
      }, this.debouncedPerformSearch)
    },

    performSearch() {
      const { searchString, songs } = this.state;
      if (searchString.length <= 1) {
        this.setState({ filteredSongs: songs })
        return;
      }
      const searchOptions = { extract: e => `${e.artist} ${e.title}` };
      const searchResults = fuzzy.filter(searchString, songs, searchOptions);

      this.setState({
        filteredSongs: searchResults.map(r => r.original)
      })
    },

    render() {
        const { filteredSongs, searchString } = this.state;

        return (
            <div className={styles.container}>
              <h1>singIT<span className={styles.version}>beta</span></h1>
              <input type="text"
                     className={styles.searchBox}
                     onChange={this.handleSearchInput}
                     value={searchString}
                     placeholder="Search" />
              <div className={styles.hits}>Hits: {filteredSongs.length}</div>
              {filteredSongs.map(s => this.renderSong(s))}
            </div>
        )
    }
});

export default Start
