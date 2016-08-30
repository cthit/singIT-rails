//@flow

import React, {PropTypes} from 'react';
import Infinite from 'react-infinite';
import Fuse from 'fuse.js';
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

    componentWillMount() {
      this.debouncedPerformSearch = _.debounce(this.performSearch, 300);
      fetchJson('/api/songs.json').then(songs => {
        const sortedSongs = songs
        .filter(s => s.title && s.title.length > 0 && s.artist && s.artist.length > 0)
        .sort((a, b) => {
          const artistDiff = a.artist.toLowerCase().localeCompare(b.artist.toLowerCase());
          return artistDiff == 0
            ? a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            : artistDiff;
        });
        this.setState({
          songs: sortedSongs,
          filteredSongs: sortedSongs
        })
      });
    },

    renderSong(song) {
      const imagePath = song.imageUrl === null ? "/default_cover.png" : `/images/${song.mp3hash}.png`
      return (
        <div key={song.id} className={styles.song}>
          <img src={imagePath} className={styles.cover} />
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

      const options = {
          shouldSort: true,
          threshold: 0.4,
          maxPatternLength: 32,
          keys: [
                "title",
                "artist"
            ]
      };


      if (searchString.length <= 1) {
        this.setState({ filteredSongs: songs });
        return;
      }
      const fuse = new Fuse(songs, options);
      const result = fuse.search(searchString);

      this.setState({
        filteredSongs: result
      })
    },

    render() {
        const { filteredSongs, searchString } = this.state;

        return (
            <div className={styles.container}>
              <h1>singIT<span className={styles.version}>beta</span></h1>
              <input type="text"
                     autoFocus={true}
                     className={styles.searchBox}
                     ref="searchInput"
                     onChange={this.handleSearchInput}
                     value={searchString}
                     placeholder="Search" />
              <div className={styles.hits}>Hits: {filteredSongs.length}</div>
              <Infinite useWindowAsScrollContainer elementHeight={50}>
                {filteredSongs.map(s => this.renderSong(s))}
              </Infinite>
            </div>
        )
    }
});

export default Start
