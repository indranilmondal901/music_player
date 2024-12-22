import React, { useState } from "react";

const Sidebar = ({ navItem, setNavItem }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="sidebar">
      <div className="spotify-logo">
        <img src="/assets/Vector.png" alt="logo" />
      </div>

      <button className="hamburger">
        <i class="fa-solid fa-bars" color="#fff"></i>
      </button>

      <ul className="nav flex-column">
        <li className="nav-item">
          <a
            className={navItem === "For You" ? "nav-link active" : "nav-link"}
            href="#"
            onClick={() => setNavItem("For You")}
          >
            For You
          </a>
        </li>
        <li className="nav-item">
          <a
            className={
              navItem === "Top Tracks" ? "nav-link active" : "nav-link"
            }
            href="#"
            onClick={() => setNavItem("Top Tracks")}
          >
            Top Tracks
          </a>
        </li>
        <li className="nav-item">
          <a
            className={
              navItem === "Favourites" ? "nav-link active" : "nav-link"
            }
            href="#"
            onClick={() => setNavItem("Favourites")}
          >
            Favourites
          </a>
        </li>
        <li className="nav-item">
          <a
            className={
              navItem === "Recently Played" ? "nav-link active" : "nav-link"
            }
            href="#"
            onClick={() => setNavItem("Recently Played")}
          >
            Recently Played
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
