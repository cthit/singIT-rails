//@flow

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { List } from 'react-virtualized';
import FuzzySearch from 'fuzzy-search'
import _ from 'lodash';
import {fetchJson, fetchSongs} from '../../services/backend';
import SongItem from '../song-item'

import styles from './style.css'


const timeSort = [['created_at'], ['desc']];
const artistSort = [['artist', 'title'], ['asc', 'asc']];

class Start extends React.Component {
    state = {
        searchString: '',
        songs: [],
        filteredSongs: [],
        sortingMethod: artistSort
    };

    componentWillMount() {
      this.debouncedPerformSearch = _.debounce(this.performSearch, 100);
      fetchSongs().then(songs => {
        const sortedSongs = _.orderBy(songs
          .filter(s => s.title && s.title.length > 0 && s.artist && s.artist.length > 0), ...artistSort);
        const options = {
            sort: true
        };
        this.searcher = new FuzzySearch(sortedSongs, ["title", "artist"], options);
        this.setState({
          songs: sortedSongs,
          filteredSongs: sortedSongs,
          sortingMethod: artistSort
        })
      });
    }

    handleSearchInput = (event) => {
      ReactDOM.findDOMNode(this.songlist).scrollTop = 0

      this.setState({
        searchString: event.target.value
      }, this.debouncedPerformSearch)
    }

    performSearch = () => {
      const { searchString, songs } = this.state;

      if (searchString.length <= 1) {
        this.setState({ filteredSongs: songs });
        return;
      }
      const result = this.searcher.search(searchString);

      this.setState({
        filteredSongs: result
      })
    }

    sortSongs = (sortingMethod) => {
      const songs = _.orderBy(this.state.songs, ...sortingMethod);
      const filteredSongs = _.orderBy(this.state.filteredSongs, ...sortingMethod);
      this.setState({songs, filteredSongs, sortingMethod}, () => this.songlist.forceUpdateGrid())
    }

    renderSortButton() {
      switch (this.state.sortingMethod) {
        case artistSort:
          return <i className="fa fa-clock-o" onClick={() => this.sortSongs(timeSort)}></i>
        case timeSort:
          return <i className="fa fa-sort-alpha-asc" onClick={() => this.sortSongs(artistSort)}></i>
        default:
          return <i className="fa fa-clock-o" onClick={() => this.sortSongs(timeSort)}></i>
        }
    }

    renderRow = ({
      index,       // Index of row within collection
      style        // Style object to be applied to row (to position it)
    }) => {
      const { filteredSongs } = this.state;
      const song = filteredSongs[index];

      return <SongItem key={song.song_hash} style={style} song={song} />
    }

    render() {
        const { filteredSongs, searchString } = this.state;

        return (
          <div className={styles.container}>
            <div className={styles.sticky}>
              <div className={styles.searchAndSort}>
                <input type="search"
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
            <List height={window.innerHeight - 74}
                  ref={(songlist) => this.songlist = songlist}
                  rowHeight={48}
                  width={window.innerWidth}
                  rowCount={filteredSongs.length}
                  preloadAdditionalHeight={window.innerHeight*2}
                  rowRenderer={this.renderRow}
                  className={styles.songList}
            />
          </div>
        )
    }
}

export default Start
