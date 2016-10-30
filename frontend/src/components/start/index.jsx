//@flow

import React, {PropTypes} from 'react';
import Infinite from 'react-infinite';
import Fuse from 'fuse.js';
import _ from 'lodash';
import moment from 'moment';
import {fetchJson} from '../../services/backend';

import styles from './style.css'

const Start = React.createClass({
    getInitialState() {
      return {
        searchString: '',
        songs: [],
        filteredSongs: [],
        sortingMethod: this.artistSort
      };
    },

    componentWillMount() {
      this.debouncedPerformSearch = _.debounce(this.performSearch, 300);
      fetchJson('/api/songs.json').then(songs => {
        const sortedSongs = songs
        .filter(s => s.title && s.title.length > 0 && s.artist && s.artist.length > 0)
        .sort(this.artistSort);
        this.setState({
          songs: sortedSongs,
          filteredSongs: sortedSongs,
          sortingMethod: this.artistSort
        })
      });
    },

    renderDate(date) {
      if ((new Date(date)).getYear() === (new Date()).getYear())
        return <div className={styles.date}>{moment(date).format("D/M")}</div>
      else
        return <div className={styles.date}>{moment(date).format("YYYY")}</div>
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
          {this.renderDate(song.created_at)}
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

    artistSort(a, b) {
      const artistDiff = a.artist.toLowerCase().localeCompare(b.artist.toLowerCase());
      return artistDiff == 0
        ? a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        : artistDiff;
    },

    timeSort(a, b) {
      return a.created_at == b.created_at ? 0 : a.created_at < b.created_at ? 1 : -1;
    },

    sortSongs(sortingMethod) {
      const songs = this.state.songs.sort(sortingMethod);
      const filteredSongs = this.state.filteredSongs.sort(sortingMethod);
      this.setState({songs, filteredSongs, sortingMethod})
    },

    renderSortButton() {
      switch (this.state.sortingMethod) {
        case this.artistSort:
          return <i className="fa fa-clock-o" onClick={() => this.sortSongs(this.timeSort)}></i>
        case this.timeSort:
          return <i className="fa fa-sort-alpha-asc" onClick={() => this.sortSongs(this.artistSort)}></i>
        default:
          return <i className="fa fa-clock-o" onClick={() => this.sortSongs(this.timeSort)}></i>
        }
    },

    render() {
        const { filteredSongs, searchString } = this.state;

        return (
          <div className={styles.container}>
            <div className={styles.sticky}>
              <div className={styles.searchAndSort}>
                <input type="text"
                       autoFocus={true}
                       className={styles.searchBox}
                       ref="searchInput"
                       onChange={this.handleSearchInput}
                       value={searchString}
                       placeholder="Search" />
                 {this.renderSortButton()}
               </div>
              <div className={styles.hits}>Hits: {filteredSongs.length}</div>
            </div>
            <Infinite useWindowAsScrollContainer elementHeight={50} className={styles.songList}>
              {filteredSongs.map(s => this.renderSong(s))}
            </Infinite>
          </div>
        )
    }
});

export default Start
