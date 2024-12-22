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
  const audioPlayerRef = useRef(null);
  const [optionBtnClicked, setOptionBtnClicked] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const togglePlaylist = () => {
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsPlaylistOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsPlaylistOpen(true);
    }
  }, [navItem]);

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

  const handlePrevTrack = () => {
    let findIndex = allSongs.findIndex((s) => s.id === currentSong.id);
    if (findIndex > -1 && findIndex !== 0) {
      setCurrentSong(allSongs[findIndex - 1]);
    } else {
      setCurrentSong(allSongs[allSongs.length - 1]);
    }
  };

  const handleNextTrack = () => {
    let findIndex = allSongs.findIndex((s) => s.id === currentSong.id);
    if (findIndex > -1 && findIndex < allSongs.length - 1) {
      setCurrentSong(allSongs[findIndex + 1]);
    } else {
      setCurrentSong(allSongs[0]);
    }
  };

  return (
    <div className="Player-container">
      <button className="hamburger-playlist" onClick={togglePlaylist}>
        {isPlaylistOpen ? `Hide Playlist` : `Show Playlist`}
      </button>
      {isPlaylistOpen && (
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
      )}
      {!isPlaylistOpen && (
        <div className="song-info">
          <div className="song-title">
            {currentSong.title || "Please Select Song"}
          </div>
          <div className="song-artist">{currentSong.artist}</div>
        </div>
      )}
      {!isPlaylistOpen && (
        <div className="album-art">
          <img src={currentSong.coverUrl || `/assets/cd.webp`} />
        </div>
      )}
      <div className="controls">
        {isPlaylistOpen && (
          <div className="small-song-info">
            <div className="song-title">{currentSong.title}</div>
            <div className="song-artist">{currentSong.artist}</div>
          </div>
        )}

        <AudioPlayer
          ref={audioPlayerRef}
          autoPlay
          src={currentSong.audioUrl}
          onPlay={() => AddToRecentlyPlayed(currentSong)}
          onEnded={handleNextTrack}
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
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "5px 10px",
                    display: "block",
                    width: "100%",
                    zIndex: 2,
                  }}
                  className={`favorite-btn ${
                    favourites.some((fs) => fs.id === currentSong.id)
                      ? "favorited"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    AddToFavourites(currentSong);
                  }}
                >
                  {favourites.some((fs) => fs.id === currentSong.id) ? (
                    <span>Added in</span>
                  ) : (
                    <span>Add to</span>
                  )}
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              )}
            </div>,
          ]}
          customIcons={{
            forward: (
              <div
                aria-label="Forward"
                className="rhap_button-clear rhap_main-controls-button rhap_forward-button"
                type="button"
                onClick={handleNextTrack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M13 6v12l8.5-6M4 18l8.5-6L4 6z"
                  ></path>
                </svg>
              </div>
            ),
            rewind: (
              <div
                aria-label="Rewind"
                className="rhap_button-clear rhap_main-controls-button rhap_rewind-button"
                type="button"
                onClick={handlePrevTrack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M11 6v12L2.5 12M20 18l-8.5-6L20 6z"
                  ></path>
                </svg>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Player;
