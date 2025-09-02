import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Searchbar.css";
import TrendingBooks from "./Trendingbooks";

export default function BookFinder({
  favourites,
  addToFavourites,
  recentSearches,
  addRecentSearch,
}) {
  const [filter, setFilter] = useState("title");
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [listening, setListening] = useState(false); // 🎤 mic state
  const navigate = useNavigate();

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery) {
      setBooks([]);
      setNoResults(true);
      return;
    }

    try {
      let url = "https://openlibrary.org/search.json?";

      if (filter === "title") url += `title=${encodeURIComponent(searchQuery)}&`;
      if (filter === "author") url += `author=${encodeURIComponent(searchQuery)}&`;
      if (filter === "year") url += `q=${encodeURIComponent(searchQuery)}&`;

      const response = await fetch(url);
      const data = await response.json();

      let results = data.docs;
      if (filter === "year") {
        results = results.filter((book) => book.first_publish_year == searchQuery);
      }

      setNoResults(results.length === 0);
      setBooks(results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching books:", error);
      setNoResults(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // 🎤 Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setQuery(voiceQuery);
      handleSearch(voiceQuery); // 🔍 Auto search with voice
      setListening(false);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="container">
      <h1 className="title">📚 Book Finder</h1>

      {/* Search Section */}
      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="year">Year</option>
        </select>

        <input
          type={filter === "year" ? "number" : "text"}
          placeholder={`Search by ${filter}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={() => handleSearch()}>Search</button>
        <button onClick={handleVoiceSearch} className="mic-btn">
          {listening ? "🎙️ Listening..." : "🎤"}
        </button>
      </div>

      {noResults ? (
        <p className="no-results">❌ No results found</p>
      ) : (
        <div className="results">
          {books.map((book, idx) => (
            <div key={idx} className="book-card">
              <h2
                onClick={() =>
                  navigate(`/book/${book.key.replace("/works/", "")}`)
                }
              >
                {book.title}
              </h2>
              <p>
                {book.author_name
                  ? book.author_name.join(", ")
                  : "Unknown Author"}
              </p>
              <p>📅 {book.first_publish_year || "Year Unknown"}</p>
              {book.cover_i && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                />
              )}
              <button onClick={() => addToFavourites(book)}>
                Add to Favourites
              </button>
            </div>
          ))}
        </div>
      )}
      <TrendingBooks />
    </div>
  );
}
