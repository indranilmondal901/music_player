import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Sidebar from "./components/Sidebar";
import TrackList from "./components/TrackList";
import Player from "./components/Player";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60); // Calculate minutes
  const remainingSeconds = seconds % 60; // Calculate remaining seconds

  // Format minutes and seconds to always show two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
function App() {
  const [navItem, setNavItem] = useState("For You");
  const [allSongs, setAllSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState({});
  const [query, setQuery] = useState("");

  const [favourites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const loadInitialData = () => {
    const url =
    "https://deezerdevs-deezer.p.rapidapi.com/search?q=arijit_singh";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "e5f292351cmshd1c4ca998734e82p1edd8bjsnc33e4751bf65",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const formattedData = data.data.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        coverUrl: track.album.cover_medium,
        audioUrl: track.preview,
        duration: formatTime(track.duration),
      }));
      // console.log(formattedData);
      setAllSongs(formattedData);
      if(Object.keys(currentSong).length === 0) {
        setCurrentSong(formattedData[0]);
      }
    });
  };

  /* when the app is load */
  useEffect(() => {
    loadInitialData();
    let favSongList = JSON.parse(localStorage.getItem("favourites") || "[]");
    if (favSongList.length >= 0) {
      setFavorites(favSongList);
    } else {
      setFavorites([]);
    }

    let recentSongList = JSON.parse(
      sessionStorage.getItem("recentlyPlayed") || "[]"
    );
    if (recentSongList.length >= 0) {
      setRecentlyPlayed(recentSongList);
    } else {
      setRecentlyPlayed([]);
    }
  }, []);

  const handleSearchSong = async(query) => {
    // if (query === "") return;
    // const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "x-rapidapi-key": "e5f292351cmshd1c4ca998734e82p1edd8bjsnc33e4751bf65",
    //     "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    //   },
    // };
    // fetch(url, options)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     const formattedData = data.data.map((track) => ({
    //       title: track.title,
    //       artist: track.artist.name,
    //       coverUrl: track.album.cover_medium,
    //       audioUrl: track.preview,
    //     }));
    //     setAllSongs(formattedData);
    //   });
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "e5f292351cmshd1c4ca998734e82p1edd8bjsnc33e4751bf65",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      let formattedData =  data.data.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        coverUrl: track.album.cover_medium,
        audioUrl: track.preview,
        duration: formatTime(track.duration),
      }));
        setAllSongs(formattedData);
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  };

  // const AddToFavourites = (song) => {
  //   let isPresent = favourites.find((favourite) => favourite.id === song.id);
  //   if (isPresent) {
  //     setFavorites((prev) =>
  //       prev.filter((favourite) => favourite.id !== song.id)
  //     );
  //   } else {
  //     setFavorites((prev) => [...prev, song]);
  //   }
  // };

  // useEffect(() => {
  //   if (favourites.length > 0) {
  //     localStorage.setItem("favourites", JSON.stringify(favourites));
  //   }
  //   if (recentlyPlayed.length > 0) {
  //     sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
  //   }
  // }, [favourites, recentlyPlayed]);

  /* Data change according to nav Item */
  useEffect(() => {
    if (navItem === "For You") {
      loadInitialData();
    } else if (navItem === "Favourites") {
      setAllSongs(favourites);
    } else if (navItem === "Recently Played") {
      setAllSongs(recentlyPlayed);
    }
  }, [navItem]);

  return (
    <div className="app-container">
      <Sidebar navItem={navItem} setNavItem={setNavItem} />
      <TrackList
        navItem={navItem}
        allSongs={allSongs}
        favourites={favourites}
        // AddToFavourites={AddToFavourites}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        query={query}
        setQuery={setQuery}
        handleSearchSong={handleSearchSong}
      />
      <Player
        currentSong={currentSong}
        favourites={favourites}
        setFavorites={setFavorites}
        recentlyPlayed={recentlyPlayed}
        setRecentlyPlayed={setRecentlyPlayed}

        navItem={navItem}
        allSongs={allSongs}
        setCurrentSong={setCurrentSong}
        query={query}
        setQuery={setQuery}
        handleSearchSong={handleSearchSong}
      />
    </div>
  );
}

export default App;
