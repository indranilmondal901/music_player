import React, { useRef, useState } from "react";

const Controller = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // Progress as a percentage (0-100)
    const progressBarRef = useRef(null);
    const [volume, setVolume] = useState(1); // Volume between 0 and 1
  
    const togglePlay = () => {
      setIsPlaying(!isPlaying);
      // Add your play/pause logic here (e.g., controlling an audio element)
    };
  
    const handleProgressChange = (e) => {
      const newProgress = e.target.value;
      setProgress(newProgress);
      // Update the audio's current time based on the new progress
      // Example: audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    };
  
    const handleVolumeChange = (event) => {
      setVolume(event.target.value);
      // Set the volume of the audio element here
      // if (audioRef.current){
      //     audioRef.current.volume = event.target.value
      // }
    };
  
  return (
    <div className="player-controls">
      <div className="options-button">...</div> {/* Options button */}
      <div className="controls">
        <button className="previous-button">{"<<"}</button>
        <button className="play-pause-button" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"} {/* Use icons or images for better visuals */}
        </button>
        <button className="next-button">{">>"}</button>
      </div>
      {/* <div className="progress-bar-container">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="progress-bar"
              ref={progressBarRef}
            />
          </div> */}
      <div className="volume-container">
        {/* <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-bar"
            /> */}
        <span className="volume-icon">
          {volume > 0.5 ? "🔊" : volume > 0 ? "🔉" : "🔇"}
        </span>
      </div>
    </div>
  );
};

export default Controller;
