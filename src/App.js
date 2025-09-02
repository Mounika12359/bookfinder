import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookFinder from "./components/Searchbar";
import BookDetails from "./components/Bookcard";
import Favorites from "./components/Favourites";
import { useState } from "react";
import "./App.css";
import { FaHeart } from "react-icons/fa";


export default function App() {
  const [favourites, setFavourites] = useState([]);
  

  const addToFavourites = (book) => {
    if (!favourites.find((fav) => fav.key === book.key)) {
      setFavourites([...favourites, book]);
    }
  };

  const removeFromFavourites = (bookKey) => {
    setFavourites(favourites.filter((fav) => fav.key !== bookKey));
  };

  return (
    <Router>
      {/* ✅ Navbar with CSS class */}
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/favorites">
  <FaHeart style={{color:"red"}} /> My Favorites <span className="count">({favourites.length})</span>
        </Link>
      </nav>

      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <BookFinder
                favourites={favourites}
                addToFavourites={addToFavourites}
              />
            }
          />
          <Route
            path="/book/:id"
            element={
              <BookDetails
                favourites={favourites}
                addToFavourites={addToFavourites}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <Favorites
                favourites={favourites}
                removeFromFavourites={removeFromFavourites}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
