import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Sidebar from "./components/Sidebar";
import TrackList from "./components/TrackList";
import Player from "./components/Player";

import { data } from "./backupData";

const API_KEY = process.env.REACT_APP_API_KEY || "";
const API_HOST = process.env.REACT_APP_API_HOST || "";
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60); // Calculate minutes
  const remainingSeconds = seconds % 60; // Calculate remaining seconds

  // Format minutes and seconds to always show two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
function App() {
  const [navItem, setNavItem] = useState("For You");
  const [allSongs, setAllSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState({});
  const [query, setQuery] = useState("");

  const [favourites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  const getTopSong = (arr) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    const randomFive = shuffled.slice(0, 5);
    setTopSongs(randomFive);
  };
  /* initail song --api call : fallback dummy data */
  const loadInitialData = async () => {
    const url =
      "https://deezerdevs-deezer.p.rapidapi.com/search?q=arijit_singh";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

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
      getTopSong(formattedData);

      if (Object.keys(currentSong).length === 0) {
        setCurrentSong(formattedData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error.message);
      setAllSongs(data);
      getTopSong(data);
      if (Object.keys(currentSong).length === 0) {
        // console.log("here", data[0]);
        setCurrentSong(data[0]);
      }
    }
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

  /* search */
  const handleSearchSong = async (query) => {
    if (query === "") {
      loadInitialData();
    }
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      let formattedData = data.data.map((track) => ({
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
      const filteredSongs = data.filter((song) =>
        song.title.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredSongs.length) {
        setAllSongs(filteredSongs);
      } else {
        setAllSongs([]);
      }
    }
  };

  /* Data change according to nav Item */
  useEffect(() => {
    if (navItem === "For You") {
      loadInitialData();
    } else if (navItem === "Favourites") {
      setAllSongs(favourites);
    } else if (navItem === "Recently Played") {
      setAllSongs(recentlyPlayed);
    } else if (navItem === "Top Tracks") {
      setAllSongs(topSongs);
    }
  }, [navItem]);

  return (
    <div className="app-container">
      <Sidebar navItem={navItem} setNavItem={setNavItem} />
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
