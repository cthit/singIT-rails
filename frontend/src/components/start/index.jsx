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

        const searchOptions = { extract: e => `${e.artist} ${e.title}` };
        const searchResult = fuzzy.filter(searchString, songs, searchOptions);

        return (
            <div>
              <h1>singIT</h1>
              <input type="text"
                     className={styles.searchBox}
                     onChange={this.handleSearchInput}
                     value={searchString}
                     placeholder="Search" />
              {searchResult.map(s => this.renderSong(s.original))}
            </div>
        )
    }
});

export default Start
