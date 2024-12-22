import React, { useEffect, useState } from "react";

const Sidebar = ({ navItem, setNavItem }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="spotify-logo">
        <img src="/assets/Vector.png" alt="logo" />
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        <i className="fa-solid fa-bars" color="#fff"></i>
      </button>

      <ul className={!isMenuOpen ? "nav flex-column" : "dialog"}>
        <li className="nav-item">
          <a
            className={navItem === "For You" ? "nav-link active" : "nav-link"}
            href="#"
            onClick={() => {
              setIsMenuOpen(false);
              setNavItem("For You");
            }}
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
            onClick={() => {
              setIsMenuOpen(false);
              setNavItem("Top Tracks");
            }}
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
            onClick={() => {
              setIsMenuOpen(false);
              setNavItem("Favourites");
            }}
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
            onClick={() => {
              setIsMenuOpen(false);
              setNavItem("Recently Played");
            }}
          >
            Recently Played
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
