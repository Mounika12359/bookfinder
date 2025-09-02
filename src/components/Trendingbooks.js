import React, { useEffect, useState } from "react";
import "./Trending.css" 
import { useNavigate } from "react-router-dom";

function TrendingBooks() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://openlibrary.org/subjects/fiction.json?limit=10")
      .then((res) => res.json())
      .then((data) => setBooks(data.works || []))
      .catch((err) => console.error("Error fetching trending books:", err));
  }, []);

  return (
    <div className="trending-container">
      <h2>📚 Trending Books</h2>
      <div className="trending-grid">
        {books.map((book) => (
          <div key={book.key} className="trending-card">
            <img
              src={
                book.cover_id
                  ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                  : "https://via.placeholder.com/150"
              }
              alt={book.title}
            />
            <h3 onClick={() => navigate(`/book/${book.key.replace("/works/", "")}`)}>{book.title}</h3>
            <p>{book.authors?.[0]?.name || "Unknown Author"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingBooks;
