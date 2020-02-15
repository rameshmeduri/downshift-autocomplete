import React, { Component } from 'react';
import { render } from 'react-dom';
import Downshift from 'downshift';
import axios from 'axios';

import './styles.css';

class AutoComplete extends Component {

  state = { movies: [] };

  inputOnChange = (event) => {
    if (!event.target.value) {
      return;
    }
    this.fetchMovies(event.target.value);
  }

  downshiftOnChange(selectedMovie) {
    console.log(`your favourite movie is ${selectedMovie.title}`);
  }

  fetchMovies(movie) {
    const moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=1b5adf76a72a13bad99b8fc0c68cb085&query=${movie}`;
    axios.get(moviesURL).then((response) => {
      this.setState({ movies: response.data.results });
    });
  }

  render() {
    return (
      <Downshift
        onChange={this.downshiftOnChange}
        itemToString={(item) => (item ? item.title : '')}
      >
        {({
          selectedItem,
          getInputProps,
          getItemProps,
          highlightedIndex,
          isOpen,
          inputValue,
          getLabelProps
        }) => (
            <div>
              <label
                style={{ marginTop: '1rem', display: 'block' }}
                {...getLabelProps()}
              >
                Choose your favourite movie
            </label>{' '}
              <br />
              <input
                {...getInputProps({
                  placeholder: 'Search movies',
                  onChange: this.inputOnChange
                })}
              />
              {isOpen ? (
                <div className="downshift-dropdown">
                  {this.state.movies
                    .filter(
                      (item) =>
                        !inputValue ||
                        item.title
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((item, index) => (
                      <div
                        className="dropdown-item"
                        {...getItemProps({ key: index, index, item })}
                        style={{
                          backgroundColor:
                            highlightedIndex === index ? 'lightgray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal'
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          )}
      </Downshift>
    );
  }
}

render(<AutoComplete />, document.getElementById('root'));