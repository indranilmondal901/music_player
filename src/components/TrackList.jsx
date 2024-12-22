import React from "react";
import PlayAnimation from "./PlayAnimation";

const TrackList = ({
  loader,
  navItem,
  allSongs,
  favourites,
  AddToFavourites,
  currentSong,
  setCurrentSong,
  query,
  setQuery,
  handleSearchSong,
}) => {
  // if (allSongs.length === 0) return <h1>Loading Data.Please wait...</h1>;

  return (
    <div className="main-content">
      <h3 className="content-type">{navItem || ""}</h3>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => handleSearchSong(query)}
        />
        <button>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      {/* <div className="menu-button" onclick="toggleMenu()">☰</div> */}
      {loader ? (
        <PlayAnimation />
      ) : (
        <div className="song-list">
          {allSongs.map((song, index) => (
            <div
              key={index}
              className={`song-item ${
                currentSong && currentSong.id === song.id ? " current-play" : ""
              }`}
              onClick={() => setCurrentSong(song)}
            >
              <div className="round-img">
                <img src={song.coverUrl} alt={song.title} />
              </div>
              <div className="song-data">
                <div className="song-title">{song.title}</div>
                <div className="song-details">
                  <span className="song-artist">{song.artist}</span>
                  <span className="song-duration">{song.duration}</span>
                </div>
              </div>

              {/* <button
              className={`favorite-btn ${
                favourites &&
                favourites.length > 0 &&
                favourites.some((fs) => fs.id === song.id)
                  ? "favorited"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                AddToFavourites(song);
              }}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button> */}
              {/* {currentSong && currentSong.id === song.id && <PlayAnimation />} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackList;
