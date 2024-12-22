import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import TrackList from "./TrackList";

const Player = ({
  currentSong,
  favourites,
  setFavorites,
  recentlyPlayed,
  setRecentlyPlayed,

  navItem,
  allSongs,
  setCurrentSong,
  query,
  setQuery,
  handleSearchSong,
}) => {
  const [optionBtnClicked, setOptionBtnClicked] = useState(false);

  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const togglePlaylist = () => {
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      // console.log(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsPlaylistOpen(false);
      }
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); 

  const AddToFavourites = (song) => {
    let isPresent = favourites.find((favourite) => favourite.id === song.id);
    if (isPresent) {
      setFavorites((prev) =>
        prev.filter((favourite) => favourite.id !== song.id)
      );
    } else {
      setFavorites((prev) => [...prev, song]);
    }
    setOptionBtnClicked(false);
  };

  const AddToRecentlyPlayed = (song) => {
    let isPresent = recentlyPlayed.find((track) => track.id === song.id);
    if (isPresent) {
      return;
    } else {
      setRecentlyPlayed((prev) => {
        const updatedList = [...prev, song];
        // Limit to the last 10 songs
        if (updatedList.length > 10) {
          return updatedList.slice(-10);
        }
        return updatedList;
      });
    }
  };

  useEffect(() => {
    if (favourites.length > 0) {
      localStorage.setItem("favourites", JSON.stringify(favourites));
    }
    if (recentlyPlayed.length > 0) {
      sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
    }
  }, [favourites, recentlyPlayed]);

  const handleOptionButtonClick = () => {
    setOptionBtnClicked(!optionBtnClicked);
  };

  return (
    <div className="Player-container">
      <button className="hamburger-playlist" onClick={togglePlaylist}>
        <i class="fa-solid fa-bars" color="#fff"></i>
        {isPlaylistOpen ? `Hide Playlist` : `Show Playlist`}
      </button>
      {isPlaylistOpen ? (
        <div className="track-wrapper">
          <TrackList
            navItem={navItem}
            allSongs={allSongs}
            favourites={favourites}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            query={query}
            setQuery={setQuery}
            handleSearchSong={handleSearchSong}
          />
        </div>
      ) : (
        <>
          <div className="song-info">
            <div className="song-title">{currentSong.title}</div>
            <div className="song-artist">{currentSong.artist}</div>
          </div>
          <div className="album-art">
            <img src={currentSong.coverUrl} />
          </div>
        </>
      )}
      <div className="controls">
        {/* Audio Player */}
        {isPlaylistOpen && (
          <div className="small-song-info">
            {" "}
            <div className="song-title">{currentSong.title}</div>
            <div className="song-artist">{currentSong.artist}</div>
          </div>
        )}

        <AudioPlayer
          autoPlay
          src={currentSong.audioUrl}
          onPlay={() => AddToRecentlyPlayed(currentSong)}
          customAdditionalControls={[
            <div
              key="custom-button"
              style={{ position: "relative", zIndex: 1 }}
            >
              <button
                onClick={handleOptionButtonClick}
                style={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  background: "#868686",
                  width: "20px",
                  height: "20px",
                  borderRadius: "100%",
                  border: "none",
                  cursor: "pointer",
                  // color: "#fff",
                  margin: 0,
                  padding: 0,
                }}
              >
                ...
              </button>
              {optionBtnClicked && (
                <button
                  style={{
                    position: "relative",
                    background: "#b3b3b3",
                    border: "none",
                    // color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "5px 10px",
                    display: "block",
                    width: "100%",
                    zIndex: 2,
                  }}
                  className={`favorite-btn ${
                    favourites &&
                    favourites.length > 0 &&
                    favourites.some((fs) => fs.id === currentSong.id)
                      ? "favorited"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    AddToFavourites(currentSong);
                  }}
                >
                  {favourites &&
                  favourites.length > 0 &&
                  favourites.some((fs) => fs.id === currentSong.id) ? (
                    <span>Added in</span>
                  ) : (
                    <span>Add to</span>
                  )}{" "}
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              )}
            </div>,
          ]}
        />
      </div>
    </div>
  );
};

export default Player;
